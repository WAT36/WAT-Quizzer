/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   trailingSlash: true
// };
const withInterceptStdout = require('next-intercept-stdout');
const nextConfig = withInterceptStdout(
  {
    reactStrictMode: true,
    output: 'export',
    experimental: {
      externalDir: true
    },
    trailingSlash: true,
    // E2Eカバレッジ計測(monocart-reporter)がバンドル済みJSを元のTSXへマッピングするために必要
    productionBrowserSourceMaps: true
  },
  (text) => (text.includes('Duplicate atom key') ? '' : text)
);

module.exports = nextConfig;
