import {
  OpenAIQuotaExceededError,
  buildImageSearchPrompt,
  parseImageResults,
  searchImagesWithOpenAI,
  stripReading,
} from './openaiImageSearch';

describe('openaiImageSearch', () => {
  describe('stripReading', () => {
    it.each([
      ['おかげ庵（おかげあん）', 'おかげ庵'],
      ['トラッキング(現象)', 'トラッキング'],
      ['堺屋太一（さかいや・たいち）', '堺屋太一'],
      ['エキスパンダー', 'エキスパンダー'],
      ['（全部括弧）', '（全部括弧）'],
    ])('「%s」→「%s」', (answer, expected) => {
      expect(stripReading(answer)).toBe(expected);
    });
  });

  describe('buildImageSearchPrompt', () => {
    const quiz = { quiz_sentense: '問題文', answer: 'おかげ庵（おかげあん）' };

    it('読み仮名を除いた答えを検索語の基準として伝える', () => {
      const prompt = buildImageSearchPrompt(quiz);
      expect(prompt).toContain('検索語は「おかげ庵」に');
      expect(prompt).toContain('問題: 問題文');
      expect(prompt).not.toContain('追加の指示');
    });

    it('追加指示があれば含める', () => {
      expect(buildImageSearchPrompt(quiz, '外観写真で')).toContain(
        '利用者からの追加の指示: 外観写真で',
      );
    });
  });

  describe('parseImageResults', () => {
    it('web_search_callの画像結果だけを取り出し、空の項目はnullにする', () => {
      const response = {
        output: [
          {
            type: 'web_search_call',
            results: [
              {
                type: 'image_result',
                image_url: 'https://a/1.jpg',
                thumbnail_url: 'https://a/t1.jpg',
                source_website_url: 'https://a/',
                caption: '説明',
              },
              { type: 'text_result', url: 'https://b/' },
              { type: 'image_result' }, // image_urlなし
            ],
          },
          { type: 'web_search_call', results: null }, // 打ち切られた検索
          {
            type: 'web_search_call',
            results: [
              {
                type: 'image_result',
                image_url: 'https://c/2.png',
                caption: '',
              },
            ],
          },
          { type: 'message', content: [] },
        ],
      };
      expect(parseImageResults(response)).toEqual([
        {
          image_url: 'https://a/1.jpg',
          thumbnail_url: 'https://a/t1.jpg',
          source_website_url: 'https://a/',
          caption: '説明',
        },
        {
          image_url: 'https://c/2.png',
          thumbnail_url: null,
          source_website_url: null,
          caption: null,
        },
      ]);
    });

    it.each([null, {}, { output: 'x' }])('想定外の形(%p)なら空', (response) => {
      expect(parseImageResults(response)).toEqual([]);
    });
  });

  describe('searchImagesWithOpenAI', () => {
    const jsonResponse = (status: number, body: unknown) =>
      new Response(JSON.stringify(body), { status });

    it('検証で決めた設定で画像検索を依頼し、結果を返す', async () => {
      const fetchFn = jest.fn().mockResolvedValue(
        jsonResponse(200, {
          output: [
            {
              type: 'web_search_call',
              results: [{ type: 'image_result', image_url: 'https://a/1.jpg' }],
            },
          ],
        }),
      );
      const results = await searchImagesWithOpenAI({
        prompt: 'p',
        apiKey: 'k',
        model: 'm',
        fetchFn,
      });
      expect(results).toHaveLength(1);
      const [url, init] = fetchFn.mock.calls[0];
      expect(url).toBe('https://api.openai.com/v1/responses');
      expect(init.headers.Authorization).toBe('Bearer k');
      expect(JSON.parse(init.body)).toEqual({
        model: 'm',
        tools: [
          {
            type: 'web_search',
            search_content_types: ['image'],
            image_settings: { max_results: 8, caption: true },
            user_location: { type: 'approximate', country: 'JP' },
          },
        ],
        max_tool_calls: 2,
        include: ['web_search_call.results'],
        input: 'p',
      });
    });

    it('エラー応答なら理由付きの例外にする', async () => {
      const fetchFn = jest
        .fn()
        .mockResolvedValue(
          jsonResponse(429, { error: { message: 'Rate limit' } }),
        );
      await expect(
        searchImagesWithOpenAI({
          prompt: 'p',
          apiKey: 'k',
          model: 'm',
          fetchFn,
        }),
      ).rejects.toThrow('OpenAI APIがエラーを返しました(429): Rate limit');
    });

    it.each([
      ['前払いクレジットの枯渇', { code: 'credit_balance_exhausted' }],
      [
        'クレジット不足',
        { code: 'insufficient_quota', type: 'insufficient_quota' },
      ],
      ['利用上限への到達', { code: 'billing_hard_limit_reached' }],
      ['種類だけがクレジット不足', { code: null, type: 'insufficient_quota' }],
    ])('%sは、クレジット不足のエラーにする', async (_, error) => {
      const fetchFn = jest.fn().mockResolvedValue(
        jsonResponse(429, {
          error: { message: 'You exceeded your current quota', ...error },
        }),
      );
      const promise = searchImagesWithOpenAI({
        prompt: 'p',
        apiKey: 'k',
        model: 'm',
        fetchFn,
      });
      await expect(promise).rejects.toBeInstanceOf(OpenAIQuotaExceededError);
      await expect(promise).rejects.toThrow(
        'OpenAI APIがエラーを返しました(429): You exceeded your current quota',
      );
    });

    it('混雑による429(rate_limit_exceeded)は、クレジット不足として扱わない', async () => {
      const fetchFn = jest.fn().mockResolvedValue(
        jsonResponse(429, {
          error: { message: 'Rate limit', code: 'rate_limit_exceeded' },
        }),
      );
      const error = await searchImagesWithOpenAI({
        prompt: 'p',
        apiKey: 'k',
        model: 'm',
        fetchFn,
      }).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(Error);
      expect(error).not.toBeInstanceOf(OpenAIQuotaExceededError);
    });
  });
});
