import { prisma } from 'quizzer-lib';
import {
  MAX_IMAGE_CANDIDATES,
  QuizImageSearchService,
  toImageCandidates,
} from './quizImageSearch.service';
import { searchImagesWithOpenAI } from './openaiImageSearch';
import { verifyImageCandidate } from './candidateSignature';

jest.mock('quizzer-lib', () => ({
  prisma: { quiz: { findFirst: jest.fn() } },
}));
jest.mock('./openaiImageSearch', () => ({
  ...jest.requireActual('./openaiImageSearch'),
  searchImagesWithOpenAI: jest.fn(),
}));

const image = (n: number, extra = {}) => ({
  image_url: `https://a.example/${n}.jpg`,
  thumbnail_url: `https://a.example/t${n}.jpg`,
  source_website_url: `https://a.example/p${n}`,
  caption: `説明${n}`,
  ...extra,
});

describe('QuizImageSearchService', () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env.QUIZ_IMAGE_SIGNING_SECRET = 'test-secret';
    process.env.OPENAI_API_KEY = 'sk-test';
    delete process.env.OPENAI_IMAGE_SEARCH_MODEL;
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterAll(() => {
    process.env = env;
  });

  describe('toImageCandidates', () => {
    it('問題IDとURLに対する署名を付けて返す', () => {
      const [candidate] = toImageCandidates(7, [image(1)]);
      expect(candidate).toMatchObject({
        image_url: 'https://a.example/1.jpg',
        thumbnail_url: 'https://a.example/t1.jpg',
        source_url: 'https://a.example/p1',
        caption: '説明1',
      });
      expect(
        verifyImageCandidate(
          {
            quizId: 7,
            imageUrl: candidate.image_url,
            thumbnailUrl: candidate.thumbnail_url,
          },
          candidate.signature,
        ),
      ).toBe(true);
    });

    it('同じ画像の重複と、http(s)でない画像を除く', () => {
      const candidates = toImageCandidates(1, [
        image(1),
        image(1, { caption: '重複' }),
        image(2, { image_url: 'ftp://a.example/2.jpg' }),
        image(3, { image_url: 'not a url' }),
        image(4),
      ]);
      expect(candidates.map((c) => c.image_url)).toEqual([
        'https://a.example/1.jpg',
        'https://a.example/4.jpg',
      ]);
    });

    it(`${MAX_IMAGE_CANDIDATES}件までに絞る`, () => {
      const results = Array.from({ length: 13 }, (_, i) => image(i));
      expect(toImageCandidates(1, results)).toHaveLength(MAX_IMAGE_CANDIDATES);
    });

    it('不正なサムネイル・出典のURLと、文字化けした説明文はnullにする', () => {
      const [candidate] = toImageCandidates(1, [
        image(1, {
          thumbnail_url: 'javascript:alert(1)',
          source_website_url: 'bad url',
          caption: '�n�k�E�Ôg',
        }),
      ]);
      expect(candidate).toMatchObject({
        thumbnail_url: null,
        source_url: null,
        caption: null,
      });
    });
  });

  describe('searchCandidates', () => {
    const service = new QuizImageSearchService();
    const quiz = { quiz_sentense: '問題文', answer: '答え' };

    it('削除されていない問題の問題文・答えで検索し、候補を返す', async () => {
      (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(quiz);
      (searchImagesWithOpenAI as jest.Mock).mockResolvedValue([image(1)]);
      const result = await service.searchCandidates({
        quiz_id: 5,
        hint: '図で',
      });
      expect(prisma.quiz.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 5, deleted_at: null } }),
      );
      const params = (searchImagesWithOpenAI as jest.Mock).mock.calls[0][0];
      expect(params).toMatchObject({
        apiKey: 'sk-test',
        model: 'gpt-6.2-astra',
      });
      expect(params.prompt).toContain('答え: 答え');
      expect(params.prompt).toContain('利用者からの追加の指示: 図で');
      expect(result.candidates).toHaveLength(1);
    });

    it('モデルは環境変数で変えられる', async () => {
      process.env.OPENAI_IMAGE_SEARCH_MODEL = 'other-model';
      (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(quiz);
      (searchImagesWithOpenAI as jest.Mock).mockResolvedValue([]);
      await service.searchCandidates({ quiz_id: 5 });
      expect((searchImagesWithOpenAI as jest.Mock).mock.calls[0][0].model).toBe(
        'other-model',
      );
    });

    it('問題がなければ404', async () => {
      (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        service.searchCandidates({ quiz_id: 5 }),
      ).rejects.toMatchObject({
        status: 404,
        message: '問題が見つかりません(id:5)',
      });
      expect(searchImagesWithOpenAI).not.toHaveBeenCalled();
    });

    it('APIキーが未設定なら500', async () => {
      delete process.env.OPENAI_API_KEY;
      (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(quiz);
      await expect(
        service.searchCandidates({ quiz_id: 5 }),
      ).rejects.toMatchObject({
        status: 500,
      });
    });

    it('OpenAIの失敗は理由付きの502', async () => {
      (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(quiz);
      (searchImagesWithOpenAI as jest.Mock).mockRejectedValue(
        new Error('OpenAI APIがエラーを返しました(429): Rate limit'),
      );
      await expect(
        service.searchCandidates({ quiz_id: 5 }),
      ).rejects.toMatchObject({
        status: 502,
        message:
          '画像の検索に失敗しました: OpenAI APIがエラーを返しました(429): Rate limit',
      });
    });

    it('タイムアウトは「タイムアウトしました」の502', async () => {
      (prisma.quiz.findFirst as jest.Mock).mockResolvedValue(quiz);
      const timeout = new Error('The operation was aborted due to timeout');
      timeout.name = 'TimeoutError';
      (searchImagesWithOpenAI as jest.Mock).mockRejectedValue(timeout);
      await expect(
        service.searchCandidates({ quiz_id: 5 }),
      ).rejects.toMatchObject({
        status: 502,
        message: '画像の検索に失敗しました: タイムアウトしました',
      });
    });
  });
});
