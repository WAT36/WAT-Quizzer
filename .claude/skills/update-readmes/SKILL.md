---
name: update-readmes
description: Use when the user asks to refresh/update the per-project README.md files in this monorepo to reflect the actual current state of the code — e.g. "READMEを更新して", "各プロジェクトのREADMEを最新化して", "READMEをシステムの現状に合わせて書き直して", "READMEがコードの実態とズレてる", "update the READMEs", "sync README with current code". Covers root, backend-nest, frontend-next, batch, infra, and quizzer-lib.
user-invocable: true
---

# update-readmes — READMEをコードの現状に同期する

## 対象

このモノレポには複数プロジェクトがあり、それぞれ独立した README.md を持つ:

- ルート (`README.md`) — モノレポ全体の入口
- `backend-nest/README.md` — NestJS API
- `frontend-next/README.md` — Next.js フロントエンド
- `batch/README.md` — 単発実行するバッチ/CLIスクリプト集
- `infra/README.md` — AWS CDK インフラ定義
- `quizzer-lib/` — backend/batch 共有の Prisma スキーマ・共通ロジック（README.md 未整備。必要なら新規作成を検討する)

ユーザーが対象を指定しなければ全プロジェクトを対象にする。「batchのREADMEだけ更新して」のように1つだけ指定されたらそのプロジェクトのみ扱う。

ワークスペースが増減している可能性があるので上記リストを決め打ちにせず、実行のたびに `package.json` の `workspaces` とトップレベルのディレクトリ一覧を確認し、対象漏れ・削除済みプロジェクトがないか確かめる。

## 大原則

- **README本文の記述を鵜呑みにしない。** README は更新対象そのものであり、古い可能性が最も高い情報源。必ずコード・設定ファイルなど一次情報から直接読み取る。
- **記憶や過去の会話からの推測で埋めない。** 確認できなかった項目は空欄にするか、書かずにユーザーに確認する。「たぶんこうだろう」で書かない。
- **雛形（スキャフォールド）由来の説明文はプロジェクト固有の内容に置き換える。** 例えば `backend-nest/README.md` の "A progressive Node.js framework..." のような NestJS 定型文、`frontend-next/README.md` の create-next-app 定型文、`infra/README.md` の "blank project for CDK development" 等は、このプロダクト固有の説明に書き換える。generic scaffold の文言がまだ残っていること自体が「要更新」のサイン。
- **人間が書いた実質的な説明は消さず活かす。** `batch/README.md` のような「各スクリプトの入力ファイル形式」を手で書いたドキュメントは価値が高い。丸ごと消して書き直すのではなく、実際のスクリプト一覧と突き合わせて過不足を差分更新する（後述の batch の手順を参照）。
- コードから読み取れない設計意図・理由は書かない。README は「今のシステムの状態」を映す鏡であって、なぜそう作ったかの推測を書く場所ではない。

## プロジェクト種別ごとの情報収集手順

対象ディレクトリの目印ファイルで種別を判定し、それぞれ以下を実際に読んで集める。ここに書かれているモジュール名やファイル名は執筆時点の例であり、実行のたびに実際のディレクトリを見て確認し直すこと（ハードコードしない）。

### 共通

- `package.json` の `scripts`（実行コマンド一覧）、`dependencies`/`devDependencies` の主要ライブラリとバージョン
- `.env` / `.env.example` があればキー一覧（値は書かない。秘匿情報は絶対に書かない）
- ディレクトリ構成（`find <dir> -maxdepth 2 -type d`、`node_modules`/`dist`/`.next` 等ビルド成果物は除外）

### backend-nest（NestJS, 目印: `nest-cli.json`）

- `src/` 直下のモジュールディレクトリ一覧を `find src -maxdepth 1 -type d` で確認し、機能一覧として使う
- 各モジュールの `*.controller.ts` を grep して `@Controller()` / `@Get`/`@Post`/`@Put`/`@Delete` のパスを拾い、大まかな API エンドポイント一覧を作る
- `main.ts` でグローバルプレフィックス・ポート・CORS 設定を確認
- 認証方式（`auth/` 配下、Cognito 等）を確認
- DB スキーマは `quizzer-lib/prisma/schema.prisma` が正なので、そちらを参照する旨だけ書き、重複転記しない

### frontend-next（Next.js, 目印: `next.config.js`）

- ルーティング方式を確認（`src/pages` があれば pages router、`src/app` があれば app router）。ルート一覧をディレクトリ/ファイル名から抽出
- `src/components`, `src/hooks`, `src/contexts` 等の主要ディレクトリが何を持つか一段階だけ覗く
- Storybook（`.storybook/`）や e2e（`e2e/`）が設定されていればテスト手段として記載
- 主要な環境変数（API 接続先など）を `.env*` や `next.config.js` から確認

### batch（目印: `src/*.ts` の単発スクリプト群）

- `src/` 直下と `src/tools/` の `.ts` ファイル一覧を洗い出す
- 既存 README に載っている見出し（スクリプトファイル名の `#` 見出し）と実ファイルを突き合わせる:
  - ファイルはあるが README に記載がない → 新規スクリプトとして追記する。ファイル冒頭のコメントや CLI 引数パース処理（`process.argv` 等）から入力形式・使い方を読み取る。読み取れなければ「使い方はソース参照」と明記し、憶測で仕様を書かない
  - README に記載があるがファイルが存在しない → 削除候補として扱う。勝手に消さずユーザーに確認するか、明示指示があれば削除する
  - 両方に存在するものは、実際のコード（引数の順番・列数・オプション）と README の説明が食い違っていないか照合し、ズレがあれば実装に合わせて修正する
- 既存の書きぶり（見出し `# ファイル名.ts` → 説明 → 入力フォーマットのコードブロック）のフォーマットを踏襲する

### infra（AWS CDK, 目印: `cdk.json`）

- `bin/*.ts` のエントリーポイントからスタック名一覧を確認
- `lib/stack/*.ts`, `lib/service/*.ts` を読み、どんな AWS リソース（Construct）が定義されているか（RDS, ECS, Lambda, API Gateway 等）を大まかに拾う
- `lambda/` 配下の Lambda 関数ディレクトリ一覧
- デプロイ関連コマンドは `package.json` の scripts と `cdk.json` を確認し、"Useful commands" 節を実際の scripts に合わせて更新する

### quizzer-lib（共有ライブラリ, 目印: `prisma/schema.prisma`）

- README.md が無ければ、新規作成してよいかユーザーに一言確認してから作成する
- `prisma/schema.prisma` の model 一覧、`src/api`, `src/lib`, `src/common`, `src/constant` が何を export しているかを確認
- backend-nest と batch の両方から参照される共有パッケージである旨を明記する

### ルート README.md

- `package.json` の `workspaces` から現在のサブプロジェクト一覧を取得し、モノレポ構成の説明に反映する
- 各サブプロジェクトの一行概要は、更新後の各 README の冒頭要約を転記する形でまとめる
- `docker-compose.yaml` があればローカル起動手段として触れる

## 更新の進め方

1. 対象プロジェクトを確定する（上記「対象」参照）
2. 各プロジェクトについて、上記手順で実際にファイルを読み取り「現状のサマリ」を作る（コード上に無い情報は書かない）
3. 既存 README を読み、(a) 雛形由来で置き換えるべき箇所 (b) 実質的で残すべき箇所 (c) 実態とズレている箇所 を切り分ける
4. Edit で差分更新する。scaffold 文言が支配的で全面書き直しが妥当なプロジェクトは書き直してよいが、そうでなければ最小差分で更新する
5. 更新後、各 README について「何を変えたか」を短く箇条書きでユーザーに報告する。git add/commit は行わず、ユーザーがレビューできるよう diff を残す
6. 不明点（スクリプトの使い方がコードから読み取れない、README に書かれた仕様が現行コードのものか判断できない等）は書き換えずユーザーに確認する

## 注意

- `.env` の値、API キー、接続文字列などの秘匿情報は絶対に README へ書かない（キー名だけ列挙するのは可）
- README の更新のみがスコープ。コード自体の修正やリファクタリングは行わない
- 大規模な書き直しになる場合、着手前に対象プロジェクトと方針をユーザーに一言確認してから進める
