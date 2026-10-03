import type { Page, Route } from '@playwright/test';

// e2e:buildでNEXT_PUBLIC_API_SERVERに指定するAPIの宛先
// 画面と同じオリジンにしておくことで、CORSを気にせずに差し替えられる
export const API_PREFIX = '/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// 画面から送られたAPIリクエストの記録
export interface ApiRequest {
  method: string;
  path: string;
  query: Record<string, string>;
  body: unknown;
}

export interface MockResponse {
  status?: number;
  json?: unknown;
}

type Handler = MockResponse | ((request: ApiRequest) => MockResponse);

// 画面が呼ぶAPIをpage.route()で差し替え、送られたリクエストを記録するクラス
// - on()で登録していないAPIが呼ばれた場合は500を返し、unhandledに記録する(テスト終了時にfixtureが失敗させる)
// - 同じAPIを複数回on()した場合は後から登録したものが優先される
export class ApiMock {
  private handlers: { method: HttpMethod; path: string; handler: Handler }[] = [];
  private recorded: ApiRequest[] = [];
  readonly unhandled: string[] = [];

  constructor(private readonly page: Page) {}

  async start() {
    await this.page.route(`**${API_PREFIX}/**`, (route) => this.dispatch(route));
  }

  on(method: HttpMethod, path: string, handler: Handler) {
    this.handlers.unshift({ method, path, handler });
  }

  // 指定したAPIに送られたリクエストを古い順に返す
  requests(method: HttpMethod, path: string): ApiRequest[] {
    return this.recorded.filter((r) => r.method === method && r.path === path);
  }

  private async dispatch(route: Route) {
    const request = route.request();
    const url = new URL(request.url());
    const apiRequest: ApiRequest = {
      method: request.method(),
      path: url.pathname.slice(API_PREFIX.length),
      query: Object.fromEntries(url.searchParams),
      body: parseBody(request.postData())
    };
    this.recorded.push(apiRequest);

    const matched = this.handlers.find((h) => h.method === apiRequest.method && h.path === apiRequest.path);
    if (!matched) {
      this.unhandled.push(`${apiRequest.method} ${apiRequest.path}`);
      await route.fulfill({ status: 500, json: { message: 'E2E: 未登録のAPIです' } });
      return;
    }
    const response = typeof matched.handler === 'function' ? matched.handler(apiRequest) : matched.handler;
    await route.fulfill({ status: response.status ?? 200, json: response.json ?? {} });
  }
}

const parseBody = (postData: string | null): unknown => {
  if (!postData) return undefined;
  try {
    return JSON.parse(postData);
  } catch {
    return postData;
  }
};

// 有効期限が1時間先のダミーのaccessToken
// 画面側は署名を検証せず、payloadのexpだけを見てログイン済みかを判断している
export const createDummyAccessToken = () => {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode({ sub: 'e2e-user', exp })}.dummy-signature`;
};
