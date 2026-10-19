---
name: storybook-coverage
description: >
  WAT-Quizzer(frontend-next)のStorybookカバレッジ(Storyファイルの作成率)を調査する。
  「Storybookの網羅率を知りたい」「Storyが未作成のコンポーネントは？」
  「ディレクトリ別のStory作成率」「Storybookのカバレッジを計測して」などと言われたときに使用する。
  行・分岐ベースのコードカバレッジ(@storybook/addon-coverage等)は対象外。
---

# Storybook Coverage Analyzer

WAT-Quizzer のフロントエンド(`frontend-next`)で、コンポーネントに
Storyファイルがどの程度作成されているかを集計し、日本語で報告する。

この数値は「Storyファイルの作成率」であり、コードカバレッジや
UI状態の網羅率、テストの実行成功率ではない。報告時にもそう明記する。

## 1. 前提(このプロジェクトの構成)

調査し直さなくてよい前提。構成が変わっていそうな場合だけ確認する。

- 集計対象: `frontend-next/src/components`
  - `ui-elements/`(最小単位の部品)、`ui-parts/`(部品の組み合わせ)、
    `ui-forms/`(画面ごとのフォーム・セクション)、`templates/`(レイアウト)
  - 1コンポーネント1ディレクトリで、Storyは同じディレクトリに置く
    (例: `ui-elements/button/Button.tsx` ↔ `Button.stories.tsx`)
- 除外
  - `unused/`: 使われていないコンポーネント
  - `templates/pages/`: `src/pages` のページを表示するStoryだけの置き場(ページStoryとして別に集計する)
- Storyの読み込み対象: `.storybook/main.ts` の `stories`(`*.stories.@(js|jsx|mjs|ts|tsx)` と `*.mdx`)

## 2. 集計

リポジトリルートで以下を実行し、その結果をそのまま基本集計値として使う。

```bash
node .claude/skills/storybook-coverage/scripts/check-coverage.mjs
```

オプション:

- `--root <dir>`: 集計対象(リポジトリルートからの相対パス。既定は `frontend-next/src/components`)
- `--depth <n>`: ディレクトリ別集計をまとめる階層(既定は2。例: `ui-forms/quizzer`。1にすると `ui-forms` 単位)

スクリプトの判定ルール:

- 対象コンポーネント: 大文字で始まる `.tsx` / `.jsx`(Story・テストを除く)
- 作成済み: 同名のStory(同じディレクトリ、または `__stories__/`)があるもの
- 同名のStoryがなくても、Storyの `meta.component` のimport先がそのコンポーネントなら作成済みに数え、
  「ファイル名がコンポーネントと一致しないStory」として要確認に出す
- `meta.component` が `src/pages` のページを指すStoryは「ページStory」として参考に集計する

## 3. 報告

スクリプトの出力(Markdown)をもとに、以下の順で報告する。

1. 全体集計(対象数・作成済み・未作成・カバレッジ率)
2. ディレクトリ別集計(カバレッジ率の低い順)
3. 未作成コンポーネント一覧
4. 要確認ファイル
   - ファイル名が一致しないStoryは、リネームを提案する(勝手にリネームしない)
   - 対応するコンポーネントが見つからないStoryは、中身を確認して原因を補足する
5. ページStory(参考)
6. 改善提案: 未作成コンポーネントのうち、優先して作るべきものを理由とあわせて挙げる
   - 優先度の判断基準:
     1. 複数箇所で再利用されている(`grep` で使用箇所を確認する)
     2. UIや状態管理が複雑
     3. ユーザー操作が多い
     4. ローディング・エラー・空の状態がある
     5. その他の表示専用

## 4. 禁止事項

- ソースコードやStoryファイルを変更・生成しない(調査と報告のみ)
- スクリプトの結果を推測で書き換えない。補足は「補足」と明記して分ける
