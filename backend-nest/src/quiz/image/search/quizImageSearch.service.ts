import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  prisma,
  QuizImageCandidate,
  SearchImageCandidatesOfQuizAPIResponseDto,
} from 'quizzer-lib';
import {
  buildImageSearchPrompt,
  DEFAULT_IMAGE_SEARCH_MODEL,
  OpenAIImageResult,
  OpenAIQuotaExceededError,
  searchImagesWithOpenAI,
} from './openaiImageSearch';
import { signImageCandidate } from './candidateSignature';

// 画面のグリッド(3x3)に収まる数に絞る
export const MAX_IMAGE_CANDIDATES = 9;

const isHttpUrl = (value: string | null): value is string => {
  if (!value) return false;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

// 文字コードの違いで化けた説明文（置換文字U+FFFDを含む）は表示しない
const cleanCaption = (caption: string | null): string | null =>
  caption && !caption.includes('�') ? caption : null;

// 検索結果を画面に返す候補にする（URLの不正なもの・重複を除き、件数を絞って署名を付ける）
export const toImageCandidates = (
  quizId: number,
  results: OpenAIImageResult[],
  now: number = Date.now(),
): QuizImageCandidate[] => {
  const seen = new Set<string>();
  return results
    .filter((result) => {
      if (!isHttpUrl(result.image_url) || seen.has(result.image_url)) {
        return false;
      }
      seen.add(result.image_url);
      return true;
    })
    .slice(0, MAX_IMAGE_CANDIDATES)
    .map((result) => {
      const thumbnailUrl = isHttpUrl(result.thumbnail_url)
        ? result.thumbnail_url
        : null;
      return {
        image_url: result.image_url,
        thumbnail_url: thumbnailUrl,
        source_url: isHttpUrl(result.source_website_url)
          ? result.source_website_url
          : null,
        caption: cleanCaption(result.caption),
        signature: signImageCandidate(
          { quizId, imageUrl: result.image_url, thumbnailUrl },
          now,
        ),
      };
    });
};

// 問題の参考画像をWebから探す
@Injectable()
export class QuizImageSearchService {
  async searchCandidates({
    quiz_id,
    hint,
  }: {
    quiz_id: number;
    hint?: string;
  }): Promise<SearchImageCandidatesOfQuizAPIResponseDto> {
    const quiz = await prisma.quiz.findFirst({
      select: { quiz_sentense: true, answer: true },
      where: { id: quiz_id, deleted_at: null },
    });
    if (!quiz) {
      throw new NotFoundException(`問題が見つかりません(id:${quiz_id})`);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY が設定されていません',
      );
    }

    let results: OpenAIImageResult[];
    try {
      results = await searchImagesWithOpenAI({
        prompt: buildImageSearchPrompt(quiz, hint || undefined),
        apiKey,
        model:
          process.env.OPENAI_IMAGE_SEARCH_MODEL || DEFAULT_IMAGE_SEARCH_MODEL,
      });
    } catch (error: unknown) {
      console.error(error);
      // クレジット不足は残高を補充するまで解決しないので、他の失敗（502）と区別して402で返す
      if (error instanceof OpenAIQuotaExceededError) {
        throw new HttpException(
          'OpenAIのクレジットが不足しているため、画像を検索できません',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
      const reason =
        error instanceof Error && error.name === 'TimeoutError'
          ? 'タイムアウトしました'
          : error instanceof Error
            ? error.message
            : String(error);
      throw new BadGatewayException(`画像の検索に失敗しました: ${reason}`);
    }

    return { candidates: toImageCandidates(quiz_id, results) };
  }
}
