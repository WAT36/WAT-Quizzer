# backend-nest

WAT-Quizzer の REST API サーバー。[NestJS](https://nestjs.com/) 製。

ローカルでは Express サーバーとして起動する一方、`src/main.ts` は AWS Lambda 用のハンドラー (`aws-serverless-express` 経由) もエクスポートしており、同一コードベースをサーバーレス実行にも対応させている。

## 構成

`src/` 直下は機能ごとの NestJS モジュールに分かれている（`app.module.ts` で束ねる）。DB アクセスは Prisma を利用するが、スキーマ・生成クライアントの実体は `../quizzer-lib`（backend-nest / batch / frontend-next 共有パッケージ）にあり、本アプリは `quizzer-lib` から `prisma` クライアントや共通 DTO/ユーティリティを import して使う（スキーマ本体は `../quizzer-lib/prisma/schema.prisma`）。

| モジュール | ベースパス | 概要 |
|---|---|---|
| `quiz/` | `/quiz`, `/quiz/file` | 基礎・応用問題の CRUD、ランダム/苦手問題出題、正誤記録、CSV アップロード、画像アップロード、統計 |
| `category/` | `/category` | 問題カテゴリの一覧・正答率・親子関係・件数集計 |
| `english/` | `/english`, `/english/word`, `/english/derivatives` | 英単語帳（EnglishBot）: 単語/派生語/類義語/反意語/語源、例文とテスト、出典管理 |
| `saying/` | `/saying` | 格言（さやいん）の登録・検索・出典（書籍）管理 |
| `todo/` | `/todo` | ToDo とチェック状況、日記 |
| `auth/` | `/auth` | サインイン・パスワード再設定。Cognito (`auth/cognito/`) を用いたユーザー認証・JWT 検証 (`CognitoAuthGuard`) |

各コントローラーが受け付ける具体的なエンドポイントは各 `*.controller.ts` を参照。ローカル起動時は Swagger UI が `http://localhost:4000/api` で閲覧できる。

## セットアップ

```bash
npm install
```

## 起動

```bash
# 開発（ホットリロードなし）
npm run start

# watch モード
npm run start:dev

# 本番相当
npm run start:prod
```

ローカル起動時はポート `4000` で待ち受ける（`APP_ENV=local` のときのみ `bootstrap()` が実行される）。

## テスト

```bash
# ユニットテスト
npm run test

# e2e テスト
npm run test:e2e

# カバレッジ
npm run test:cov
```

## 環境変数

`quizzer-lib` 経由の DB 接続を含め、主に以下をリポジトリルートの `.env` で管理する（値は各自の環境に合わせて設定。秘密情報のためリポジトリには含まれない）。

- `DATABASE_URL` / `DIRECT_URL` — Prisma 接続先
- `APP_ENV` — `local` のときのみ Express サーバーとして起動
- `REGION`, `AWS_COGNITO_USERPOOL_ID`, `AWS_COGNITO_APPCLIENT_ID` — Cognito 認証まわり

## Docker

リポジトリルートの `Dockerfile` / `docker-compose.yaml` から本アプリのコンテナ (`quizzer_api`, ポート `4000`) をビルド・起動できる。
