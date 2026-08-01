# WAT-Quizzer

問題演習（Quiz）・英単語帳（EnglishBot）・格言・ToDo を扱う個人用アプリケーション。npm workspaces によるモノレポ構成。

## プロジェクト構成

| ディレクトリ | 役割 |
|---|---|
| [`backend-nest/`](backend-nest/README.md) | NestJS 製 REST API サーバー |
| [`frontend-next/`](frontend-next/README.md) | Next.js 製フロントエンド（静的エクスポート） |
| [`batch/`](batch/README.md) | 単発実行するバッチ/CLIスクリプト集 |
| `quizzer-lib/` | backend-nest / batch / frontend-next 共有パッケージ（Prisma スキーマ・共通型・API クライアント・ユーティリティ） |
| [`infra/`](infra/README.md) | AWS CDK によるインフラ定義（npm workspace には含まれない独立プロジェクト） |
| `container/` | ローカル用 MySQL コンテナ定義 |

## ローカル起動

リポジトリルートの `docker-compose.yaml` で `backend-nest` の API コンテナ（ポート `4000`）を起動できる。DB を含めたローカル環境が必要な場合は `container/docker-compose.yaml`（MySQL）も参照。

各サブプロジェクトを個別に動かす場合はルートの `package.json` に以下のスクリプトがある。

```bash
npm run start:backend   # quizzer-lib をビルドし、backend-nest を watch モードで起動
npm run start:frontend  # frontend-next の開発サーバーを起動
npm run build:backend   # quizzer-lib の prisma 生成 + backend-nest ビルド
npm run build:frontend  # frontend-next のビルド
npm run deps:check      # workspace 間の依存バージョン不整合チェック (syncpack)
npm run deps:fix        # 上記の自動修正
```

詳細なセットアップ・機能・環境変数は各サブディレクトリの README を参照。
