import { parseJwt } from '../../lib/aws/cognito'

// 認証トークンの管理
// - accessTokenはXSSで盗まれにくいようメモリにだけ保持する（リロードしたら/auth/refreshで取り直す）
// - refreshTokenはAPI側がHttpOnly Cookieで管理するのでフロントからは触らない
// - refreshも失敗した場合（ログインから6時間経過など）は、画面側で登録した再ログイン処理を呼ぶ
//   ただし再ログインはこのページで一度認証済みだった（途中で切れた）場合のみ。
//   最初から未ログインの場合は呼ばず、RequiredAuthComponentがログイン画面へ移動させる

const baseURL: string = process.env.NEXT_PUBLIC_API_SERVER || ''

// 期限切れ直前のトークンで送らないよう、残りこの秒数を切ったら先に再取得する
const REFRESH_MARGIN_SEC = 120

let accessToken: string | null = null
let refreshPromise: Promise<RefreshResult> | null = null
let reauthPromise: Promise<boolean> | null = null
let reauthHandler: (() => Promise<boolean>) | null = null
// このページ（リロードするまで）で一度でもaccessTokenを取得できたか
let hasSession = false

type RefreshResult = 'success' | 'unauthorized' | 'error'

export const setAccessToken = (token: string) => {
  accessToken = token
  hasSession = true
}

export const clearAccessToken = () => {
  accessToken = null
}

export const getAccessToken = () => accessToken

// accessTokenがあり、期限まで余裕があるか
export const hasValidAccessToken = () => {
  if (!accessToken) return false
  const exp = parseJwt(accessToken)?.exp
  return (
    typeof exp === 'number' &&
    exp - REFRESH_MARGIN_SEC > Math.floor(Date.now() / 1000)
  )
}

// 再ログイン処理（モーダル表示など）を登録する。trueを返したら再ログイン成功
export const setReauthHandler = (handler: (() => Promise<boolean>) | null) => {
  reauthHandler = handler
}

// refreshTokenCookieでaccessTokenを再取得する。同時に呼ばれても通信は1回にまとめる
export const refreshAccessToken = (): Promise<RefreshResult> => {
  if (!refreshPromise) {
    refreshPromise = fetch(baseURL + '/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    })
      .then(async (response): Promise<RefreshResult> => {
        if (response.status === 401) {
          clearAccessToken()
          return 'unauthorized'
        }
        if (!response.ok) return 'error'
        const body = await response.json()
        if (typeof body?.accessToken !== 'string') return 'error'
        setAccessToken(body.accessToken)
        return 'success'
      })
      .catch((): RefreshResult => 'error')
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// 再ログインを要求する。同時に複数のAPIが失敗してもモーダルは1回だけ出す
const requestReauth = (): Promise<boolean> => {
  if (!reauthHandler || !hasSession) return Promise.resolve(false)
  if (!reauthPromise) {
    reauthPromise = reauthHandler()
      .catch(() => false)
      .finally(() => {
        reauthPromise = null
      })
  }
  return reauthPromise
}

const withAuthHeader = (init: RequestInit): RequestInit => ({
  ...init,
  headers: {
    ...(init.headers as Record<string, string> | undefined),
    Authorization: `Bearer ${accessToken}`
  }
})

// 認証付きfetch
// 送信前にトークンを用意し、それでも401なら refresh → (失敗なら)再ログイン の後に1回だけ再送する
export const authFetch = async (
  url: string,
  init: RequestInit = {}
): Promise<Response> => {
  // 再ログインのモーダルは1リクエストにつき1回まで（キャンセル時に再表示しないため）
  let reauthTried = false
  const recover = async (): Promise<boolean> => {
    const result = await refreshAccessToken()
    if (result === 'success') return true
    if (result === 'unauthorized' && !reauthTried) {
      reauthTried = true
      return requestReauth()
    }
    return false
  }

  if (!hasValidAccessToken()) {
    await recover()
  }
  const response = await fetch(url, withAuthHeader(init))
  if (response.status !== 401) return response
  return (await recover()) ? fetch(url, withAuthHeader(init)) : response
}

// ログアウト（refreshTokenの無効化とCookie削除はAPI側で行う）
export const logout = async (): Promise<void> => {
  clearAccessToken()
  hasSession = false
  await fetch(baseURL + '/auth/logout', {
    method: 'POST',
    credentials: 'include'
  }).catch((error) => {
    console.error('Logout failed', error)
  })
}
