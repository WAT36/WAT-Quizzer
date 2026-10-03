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
    // E2Eのカバレッジ計測(pnpm run e2e:coverage)の時だけ、実行されたJSを元のTSXに対応づけるためソースマップを出力する
    productionBrowserSourceMaps: process.env.E2E_COVERAGE === 'true'
  },
  (text) => (text.includes('Duplicate atom key') ? '' : text)
);

module.exports = nextConfig;
