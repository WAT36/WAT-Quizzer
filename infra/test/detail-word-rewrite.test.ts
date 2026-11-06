import * as fs from 'fs'
import * as path from 'path'

const code = fs.readFileSync(
  path.join(
    __dirname,
    '../lib/service/cloudfront-function/detail-word-rewrite.js'
  ),
  'utf8'
)
const handler = new Function(`${code}; return handler;`)()
const run = (uri: string) => handler({ request: { uri } })

const SHARED_PAGE = '/englishBot/detailWord/%5Bid%5D/index.html'

describe('detail-word-rewrite', () => {
  test.each(['/englishBot/detailWord/123', '/englishBot/detailWord/123/'])(
    '%s は共通のHTMLファイルへ読み替える',
    (uri) => {
      expect(run(uri).uri).toBe(SHARED_PAGE)
    }
  )

  test('/index.html付きのURLは末尾スラッシュの形へ転送する', () => {
    const response = run('/englishBot/detailWord/123/index.html')

    expect(response.statusCode).toBe(301)
    expect(response.headers.location.value).toBe('/englishBot/detailWord/123/')
  })

  test.each([
    '/',
    '/englishBot/index.html',
    '/englishBot/detailWord/',
    '/englishBot/detailWord/abc/',
    '/englishBot/detailWord/123/extra/',
    '/_next/static/chunks/pages/englishBot/detailWord/%5Bid%5D-abc.js'
  ])('%s は変更しない', (uri) => {
    expect(run(uri).uri).toBe(uri)
  })
})
