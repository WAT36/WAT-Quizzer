// OpenAI Responses API の web_search（画像検索）で、問題の参考画像を探す
// 設定値は実データでの検証結果から決めている
// - 検索は最大2回（1回だと、最初の検索が0件の時にやり直せず候補なしになる）
// - 検索地域は日本（指定しないと米国扱いになり、日本語の問題に不利）
// - 検索語は短く（長い検索語は画像検索で0件になりやすい）
// - 検索結果はweb_search_callから直接読むので、モデルの最終回答は短くさせて待ち時間を減らす

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
export const DEFAULT_IMAGE_SEARCH_MODEL = 'gpt-6.2-astra';
const MAX_TOOL_CALLS = 2;
const MAX_RESULTS_PER_SEARCH = 8;
// Lambda(28秒)とAPI Gateway(29秒)の制限に収まるよう、OpenAIの応答は20秒で打ち切る
export const OPENAI_TIMEOUT_MS = 20000;

// web_search_callの検索結果のうち画像のもの
export interface OpenAIImageResult {
  image_url: string;
  thumbnail_url: string | null;
  source_website_url: string | null;
  caption: string | null;
}

export interface QuizForImageSearch {
  quiz_sentense: string;
  answer: string;
}

// 答えの読み仮名などの括弧書きを除く（例: 「おかげ庵（おかげあん）」→「おかげ庵」）
export const stripReading = (answer: string): string =>
  answer.replace(/[（(][^）)]*[）)]/g, '').trim() || answer.trim();

export const buildImageSearchPrompt = (
  quiz: QuizForImageSearch,
  hint?: string,
): string =>
  [
    '次のクイズの答えを表す参考画像をWeb画像検索で探してください。',
    `検索語は「${stripReading(quiz.answer)}」に、必要なら区別のための語を1〜2個だけ足した短いものにしてください（長い検索語は結果が0件になります）。`,
    '答えが慣用句や抽象概念なら「意味 イラスト」などを足してください。',
    ...(hint ? [`利用者からの追加の指示: ${hint}`] : []),
    '検索結果はシステムが直接読み取るので、検索が終わったら最終回答は「完了」とだけ書いてください。',
    `問題: ${quiz.quiz_sentense}`,
    `答え: ${quiz.answer}`,
  ].join('\n');

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value !== '' ? value : null;

// Responses APIのレスポンスから画像の検索結果を取り出す
export const parseImageResults = (response: unknown): OpenAIImageResult[] => {
  const output = (response as { output?: unknown })?.output;
  if (!Array.isArray(output)) return [];
  return output
    .filter(
      (item): item is { type: string; results?: unknown } =>
        (item as { type?: unknown })?.type === 'web_search_call',
    )
    .flatMap((item) => (Array.isArray(item.results) ? item.results : []))
    .filter(
      (result): result is Record<string, unknown> =>
        (result as { type?: unknown })?.type === 'image_result' &&
        typeof (result as { image_url?: unknown }).image_url === 'string',
    )
    .map((result) => ({
      image_url: result.image_url as string,
      thumbnail_url: toNullableString(result.thumbnail_url),
      source_website_url: toNullableString(result.source_website_url),
      caption: toNullableString(result.caption),
    }));
};

interface SearchImagesWithOpenAIParams {
  prompt: string;
  apiKey: string;
  model: string;
  fetchFn?: typeof fetch;
  timeoutMs?: number;
}

// OpenAIに画像検索をさせ、見つかった画像を返す。通信失敗・タイムアウト・エラー応答は例外にする
export const searchImagesWithOpenAI = async ({
  prompt,
  apiKey,
  model,
  fetchFn = fetch,
  timeoutMs = OPENAI_TIMEOUT_MS,
}: SearchImagesWithOpenAIParams): Promise<OpenAIImageResult[]> => {
  const response = await fetchFn(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      tools: [
        {
          type: 'web_search',
          search_content_types: ['image'],
          image_settings: {
            max_results: MAX_RESULTS_PER_SEARCH,
            caption: true,
          },
          user_location: { type: 'approximate', country: 'JP' },
        },
      ],
      max_tool_calls: MAX_TOOL_CALLS,
      include: ['web_search_call.results'],
      input: prompt,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const reason =
      (body as { error?: { message?: unknown } } | null)?.error?.message ??
      response.statusText;
    throw new Error(
      `OpenAI APIがエラーを返しました(${response.status}): ${String(reason)}`,
    );
  }
  return parseImageResults(body);
};
