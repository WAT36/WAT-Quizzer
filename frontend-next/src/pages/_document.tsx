import { Html, Head, Main, NextScript } from 'next/document';

// 描画前にダークモードのクラスを付与し、ライト→ダークの一瞬のちらつきを防ぐ
const setInitialThemeScript = `
(function () {
  try {
    var saved = window.localStorage.getItem('themeMode');
    var isDark = saved === 'dark' || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: setInitialThemeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
