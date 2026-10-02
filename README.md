# WAT-Quizzer

問題演習（Quiz）・英単語帳（EnglishBot）・格言・ToDo を扱う個人用アプリケーション。pnpm workspace によるモノレポ構成。

## プロジェクト構成

| ディレクトリ | 役割 |
|---|---|
| [`backend-nest/`](backend-nest/README.md) | NestJS 製 REST API サーバー |
| [`frontend-next/`](frontend-next/README.md) | Next.js 製フロントエンド（静的エクスポート） |
| [`batch/`](batch/README.md) | 単発実行するバッチ/CLIスクリプト集 |
| `quizzer-lib/` | backend-nest / batch / frontend-next 共有パッケージ（Prisma スキーマ・共通型・API クライアント・ユーティリティ） |
| [`infra/`](infra/README.md) | AWS CDK によるインフラ定義（pnpm workspace には含まれない独立プロジェクト。npm で管理） |
| `container/` | ローカル用 MySQL コンテナ定義 |
| `tools/` | リポジトリ全体向けの補助スクリプト（`update_avg_lines.sh`: 全ファイルの平均行数を集計して DB に記録） |

## ローカル起動

リポジトリルートの `docker-compose.yaml` で `backend-nest` の API コンテナ（ポート `4000`）を起動できる。DB を含めたローカル環境が必要な場合は `container/docker-compose.yaml`（MySQL）も参照。

パッケージマネージャは [pnpm](https://pnpm.io/) を使用する（バージョンはルート `package.json` の `packageManager` を参照）。依存関係はリポジトリルートで一括インストールする。

```bash
pnpm install             # 全ワークスペース（backend-nest / frontend-next / quizzer-lib / batch）の依存をインストール
```

各サブプロジェクトを個別に動かす場合はルートの `package.json` に以下のスクリプトがある。

```bash
pnpm start               # 依存インストール → quizzer-lib ビルド → backend-nest と frontend-next を concurrently で同時起動
pnpm build:lib           # quizzer-lib のビルド
pnpm start:backend       # backend-nest を watch モードで起動
pnpm start:frontend      # frontend-next の開発サーバーを起動
pnpm build:backend       # quizzer-lib の prisma 生成 + backend-nest ビルド
pnpm build:frontend      # frontend-next のビルド
pnpm deps:check          # workspace 間の依存バージョン不整合チェック (syncpack)
pnpm deps:fix            # 上記の自動修正
```

### pnpm 運用メモ

- 特定ワークスペースへの依存追加: `pnpm --filter <パッケージ名> add <pkg>`（devDependencies は `-D`）
- ワークスペース内パッケージ（`quizzer-lib`）は `"quizzer-lib": "workspace:*"` で参照する
- 依存パッケージのインストールスクリプト（postinstall 等）は既定でブロックされる。実行を許可するパッケージは `pnpm-workspace.yaml` の `allowBuilds` で管理する（新たに必要になったら `pnpm approve-builds`）
- `package.json` に宣言していないパッケージは import できない（ファントム依存の防止）。使うパッケージは必ずそのワークスペースの `package.json` に追加すること

詳細なセットアップ・機能・環境変数は各サブディレクトリの README を参照。

### Git フック

`.githooks/` に Git フックを置いている。`pnpm install` 時に `prepare` スクリプトが `git config core.hooksPath .githooks` を実行するので、特別な設定は不要。

- `pre-push`: push 前に `tools/update_avg_lines.sh` を実行し、全ファイルの平均行数を DB に記録する（`batch/src/tools/avg_line.register.ts` 経由。DB 接続先はルートの `.env`）。記録に失敗しても push は止めない
- `pre-commit`: コードに変更があるのに、対応する README が更新されていない場合に警告を出す（コミットは止めない）。VS Code など GUI からのコミットでは、macOS の場合は通知でも知らせる。Claude Code（`claude` コマンド）が入っていない環境では何もしない。警告が出たら `/update-readmes` で確認する

## 脆弱性診断

Claude Code の `/security-review` スキルで、現在のブランチの差分に対して SQL インジェクション・XSS・認証/認可の不備・シークレット露出などの脆弱性診断ができる（対象は差分ベースなので、リポジトリ全体を診断したい場合は別途調査が必要）。
