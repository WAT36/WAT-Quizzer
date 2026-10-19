import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// WAT-Quizzer(frontend-next)のStoryファイル作成率を集計し、Markdownで出力する
// 使い方: node .claude/skills/storybook-coverage/scripts/check-coverage.mjs [--root <dir>] [--depth <n>]
// - --root  集計対象のディレクトリ(リポジトリルートからの相対パス。既定: frontend-next/src/components)
// - --depth ディレクトリ別集計でまとめる階層の深さ(既定: 2。例: ui-forms/quizzer)

// このスクリプトは .claude/skills/storybook-coverage/scripts/ にあるので、4階層上がリポジトリルート
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../.."
);

const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : defaultValue;
};

const targetDir = path.resolve(
  repoRoot,
  getArg("--root", "frontend-next/src/components")
);
const depth = Number(getArg("--depth", "2"));

if (!fs.existsSync(targetDir)) {
  console.error(`Directory not found: ${targetDir}`);
  process.exit(1);
}
if (!Number.isInteger(depth) || depth < 1) {
  console.error(`--depth must be a positive integer: ${depth}`);
  process.exit(1);
}

// srcディレクトリ(@/のエイリアス先)と、Pages Routerのページ置き場
const srcDir = path.dirname(targetDir);
const pagesDir = path.join(srcDir, "pages");

const excludedDirectories = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  "__tests__",
  "__mocks__",
]);

// コンポーネントの集計からは除外するディレクトリ(targetDirからの相対パス)
// - unused: 使われていないコンポーネントの置き場
// - templates/pages: src/pages のページを表示するStoryだけを置く場所(ページStoryとして別に集計する)
const excludedComponentPaths = ["unused", "templates/pages"];

function scan(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isSymbolicLink()) return [];

      if (entry.isDirectory()) {
        return excludedDirectories.has(entry.name)
          ? []
          : scan(fullPath);
      }

      return entry.isFile() ? [fullPath] : [];
    });
}

const toRepoPath = (file) => path.relative(repoRoot, file);
const toTargetPath = (file) =>
  path.relative(targetDir, file).split(path.sep).join("/");

const isExcludedComponentPath = (file) =>
  excludedComponentPaths.some((excluded) =>
    toTargetPath(file).startsWith(`${excluded}/`)
  );

// .storybook/main.ts の stories 設定(*.stories.@(js|jsx|mjs|ts|tsx))に合わせる
const storyPattern = /\.stories\.(tsx|ts|jsx|js|mjs)$/;

const files = scan(targetDir);

const isComponent = (file) => {
  const name = path.basename(file);

  return (
    /^[A-Z][a-zA-Z0-9]*\.(tsx|jsx)$/.test(name) &&
    !/\.(stories|test|spec)\./.test(name) &&
    !isExcludedComponentPath(file)
  );
};

const components = files.filter(isComponent);
const componentSet = new Set(components);
// unused/ のStoryは集計しない(templates/pages/ のStoryはページStoryとして扱う)
const storyFiles = files.filter((file) =>
  storyPattern.test(file) && !toTargetPath(file).startsWith("unused/")
);

const resolveExtensions = ["", ".tsx", ".jsx", ".ts", ".js", "/index.tsx", "/index.jsx"];

// import文のパスを実ファイルに解決する(相対パスと@/エイリアスのみ)
function resolveImport(storyFile, specifier) {
  let base;
  if (specifier.startsWith(".")) {
    base = path.resolve(path.dirname(storyFile), specifier);
  } else if (specifier.startsWith("@/")) {
    base = path.join(srcDir, specifier.slice(2));
  } else {
    return undefined;
  }

  return resolveExtensions
    .map((extension) => base + extension)
    .find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
}

// Storyのmeta.componentに指定されたコンポーネントの定義ファイルを、import文から探す
function findMetaComponentFile(storyFile) {
  const source = fs.readFileSync(storyFile, "utf8");
  const componentName = source.match(/\bcomponent:\s*([A-Za-z_$][\w$]*)/)?.[1];
  if (!componentName) return undefined;

  const importPattern = /import\s+(?:type\s+)?([\s\S]+?)\s+from\s+['"]([^'"]+)['"]/g;
  for (const [, clause, specifier] of source.matchAll(importPattern)) {
    if (new RegExp(`\\b${componentName.replace(/\$/g, "\\$")}\\b`).test(clause)) {
      return resolveImport(storyFile, specifier);
    }
  }
  return undefined;
}

// コンポーネントごとの対応Story
// 1. 同名のStory(Button.tsx ↔ Button.stories.tsx、または __stories__/Button.stories.tsx)
// 2. 1がなければ、meta.componentのimport先がそのコンポーネントであるStory(ファイル名の不一致として要確認に出す)
const storiesByComponent = new Map(components.map((component) => [component, []]));
const mismatchedStories = [];
const pageStories = [];
const unknownStories = [];

for (const story of storyFiles) {
  const name = path.basename(story).replace(storyPattern, "");
  const directory = path.dirname(story);
  const sameNameComponent = [
    path.join(directory, `${name}.tsx`),
    path.join(directory, `${name}.jsx`),
    path.join(path.dirname(directory), `${name}.tsx`),
    path.join(path.dirname(directory), `${name}.jsx`),
  ].find((file) =>
    componentSet.has(file) &&
    (path.dirname(file) === directory || path.basename(directory) === "__stories__")
  );

  if (sameNameComponent) {
    storiesByComponent.get(sameNameComponent).push(story);
    continue;
  }

  const metaComponent = findMetaComponentFile(story);

  if (metaComponent && componentSet.has(metaComponent)) {
    storiesByComponent.get(metaComponent).push(story);
    mismatchedStories.push({ story, component: metaComponent });
  } else if (metaComponent && metaComponent.startsWith(pagesDir + path.sep)) {
    pageStories.push({ story, page: metaComponent });
  } else {
    unknownStories.push(story);
  }
}

const results = components.map((component) => ({
  component,
  stories: storiesByComponent.get(component),
}));

const covered = results.filter((item) => item.stories.length > 0);
const missing = results.filter((item) => item.stories.length === 0);

const formatRate = (coveredCount, total) =>
  total ? `${((coveredCount / total) * 100).toFixed(2)}%` : "N/A";

const output = [];

output.push("## 全体集計", "");
output.push(`- 集計対象: \`${toRepoPath(targetDir)}\`(除外: ${excludedComponentPaths.map((p) => `\`${p}/\``).join(", ")})`);
output.push(`- 対象コンポーネント総数: ${components.length}`);
output.push(`- Storybook作成済み数: ${covered.length}`);
output.push(`- Storybook未作成数: ${missing.length}`);
output.push(`- カバレッジ率: ${formatRate(covered.length, components.length)}`);

// コンポーネント自身のディレクトリ(1コンポーネント1ディレクトリ)を除いた上で、先頭からdepth階層でまとめる
const groupOf = (component) => {
  const segments = toTargetPath(path.dirname(component)).split("/");
  const parents = segments.length > 1 ? segments.slice(0, -1) : segments;
  return parents.slice(0, depth).join("/");
};

const byDirectory = new Map();

for (const item of results) {
  const group = groupOf(item.component);
  const counts = byDirectory.get(group) ?? { total: 0, covered: 0 };

  counts.total++;
  if (item.stories.length) counts.covered++;

  byDirectory.set(group, counts);
}

output.push("", "## ディレクトリ別集計", "");
output.push("| ディレクトリ | 対象数 | 作成済み | 未作成 | カバレッジ率 |");
output.push("|---|---:|---:|---:|---:|");

for (const [group, counts] of [...byDirectory.entries()]
  .sort((a, b) => {
    const rateA = a[1].covered / a[1].total;
    const rateB = b[1].covered / b[1].total;
    return rateA - rateB || a[0].localeCompare(b[0]);
  })) {
  output.push(
    `| ${group} | ${counts.total} | ${counts.covered} | ${counts.total - counts.covered} | ${formatRate(counts.covered, counts.total)} |`
  );
}

output.push("", "## 未作成コンポーネント一覧", "");
output.push(...(missing.length ? missing.map((item) => `- ${toRepoPath(item.component)}`) : ["なし"]));

output.push("", "## 要確認ファイル", "");
output.push("### ファイル名がコンポーネントと一致しないStory(meta.componentから対応づけて作成済みに数えた)", "");
output.push(...(mismatchedStories.length
  ? mismatchedStories.map(({ story, component }) => `- ${toRepoPath(story)} → ${toRepoPath(component)}`)
  : ["なし"]));
output.push("", "### 対応するコンポーネントが見つからないStory", "");
output.push(...(unknownStories.length ? unknownStories.map((story) => `- ${toRepoPath(story)}`) : ["なし"]));

// ページStory(src/pages のページをmeta.componentに指定しているStory)と、Storyがないページ
if (fs.existsSync(pagesDir)) {
  const pages = scan(pagesDir).filter((file) =>
    /\.(tsx|jsx)$/.test(file) && !/^_(app|document)\./.test(path.basename(file))
  );
  const pagesWithStory = new Set(pageStories.map(({ page }) => page));
  const pagesWithoutStory = pages.filter((page) => !pagesWithStory.has(page));

  output.push("", "## ページStory(参考)", "");
  output.push(`- ページ数(_app・_documentを除く): ${pages.length}`);
  output.push(`- Storyがあるページ: ${pagesWithStory.size}`);
  output.push("- Storyがないページ:");
  output.push(...(pagesWithoutStory.length ? pagesWithoutStory.map((page) => `  - ${toRepoPath(page)}`) : ["  - なし"]));
}

console.log(output.join("\n"));
