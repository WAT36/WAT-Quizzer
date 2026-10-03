import fs from 'fs';
import path from 'path';

// E2Eのカバレッジ集計(monocart-reporter)の設定
// - テストで実行されたJS(V8カバレッジ)を、ソースマップで元のsrc/配下のTS/TSXに対応づけて集計する
// - V8カバレッジはブラウザが読み込んだファイルしか含まないため、src/配下の全ファイルを分母に加え、
//   テストで一度も開かれなかった画面も0%として集計されるようにしている

// アプリ本体(src/配下)のソースマップ上のパス
const APP_SOURCE = /^(\[project\]\/frontend-next\/)?src\//;

// JSのソースマップに、アプリ本体(src/配下)のファイルが含まれているか
// - Turbopackはソースマップを別名のファイルで出力するため、JS末尾のsourceMappingURLからたどる
// - ソースマップ上のパスは turbopack:///[project]/frontend-next/src/... の形
const containsAppSourceCache = new Map<string, boolean>();
const containsAppSource = (url: string, source = '') => {
  const { pathname } = new URL(url);
  const mapName = source.match(/\/\/# sourceMappingURL=(\S+)\s*$/)?.[1];
  if (!pathname.startsWith('/_next/static/') || !mapName) return false;
  const mapPath = path.join('out', path.dirname(pathname), mapName);
  if (!containsAppSourceCache.has(mapPath)) {
    const { sources = [] } = JSON.parse(fs.readFileSync(mapPath, 'utf8')) as { sources?: string[] };
    containsAppSourceCache.set(mapPath, sources.some((s) => s.includes('[project]/frontend-next/src/')));
  }
  return containsAppSourceCache.get(mapPath)!;
};

export const coverageOptions = {
  outputDir: './e2e-coverage/coverage',
  reports: [['v8', { inline: true }], ['console-summary'], ['json-summary'], ['markdown-summary']],

  // アプリ本体のコードを含むJSだけを対象にする(ライブラリだけのJSや、Next.jsのマニフェスト・ページ読み込み用のJSは除く)
  entryFilter: (entry: { url: string; source?: string }) => containsAppSource(entry.url, entry.source),

  // ソースマップ上のパス([project]/frontend-next/src/...)を、src/... にそろえる
  sourcePath: { '[project]/frontend-next/': '' },

  // 自前のコード(src/配下)だけに絞る。Storybook用のファイルは除く
  sourceFilter: (sourcePath: string) => APP_SOURCE.test(sourcePath) && !sourcePath.includes('.stories.'),

  all: {
    dir: ['./src'],
    filter: (filePath: string) => /\.tsx?$/.test(filePath) && !filePath.endsWith('.d.ts') && !filePath.includes('.stories.'),
    // 未テストのTS/TSXはそのままでは解析できないため、esbuildでJSに変換してから集計する
    transformer: async (entry: { url: string; source: string; sourceMap?: unknown }) => {
      const { transform } = await import('esbuild');
      const { code, map } = await transform(entry.source, {
        loader: entry.url.endsWith('.tsx') ? 'tsx' : 'ts',
        jsx: 'automatic',
        format: 'esm',
        sourcemap: 'external',
        sourcefile: entry.url
      });
      entry.source = code;
      entry.sourceMap = JSON.parse(map);
    }
  }
};
