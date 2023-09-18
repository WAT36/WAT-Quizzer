/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   trailingSlash: true
// };
const withInterceptStdout = require('next-intercept-stdout');
const nextConfig = withInterceptStdout(
  {
    reactStrictMode: true,
    trailingSlash: true
  },
  (text) => (text.includes('Duplicate atom key') ? '' : text)
);

module.exports = nextConfig;
