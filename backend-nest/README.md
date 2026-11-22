# backend-nest

WAT-Quizzer の REST API サーバー。[NestJS](https://nestjs.com/) 製。

ローカルでは Express サーバーとして起動する一方、`src/main.ts` は AWS Lambda 用のハンドラー (`aws-serverless-express` 経由) もエクスポートしており、同一コードベースをサーバーレス実行にも対応させている。

## 構成

`src/` 直下は機能ごとの NestJS モジュールに分かれている（`app.module.ts` で束ねる）。`src/common/` はモジュールではなく、複数モジュールで使う共通処理を置く（`common/csv/`: CSV の読み込み `parseCsv` と、行番号付きでエラーを集めて 400 で返すなどの検証用部品）。DB アクセスは Prisma を利用するが、スキーマ・生成クライアントの実体は `../quizzer-lib`（backend-nest / batch / frontend-next 共有パッケージ）にあり、本アプリは `quizzer-lib` から `prisma` クライアントや共通 DTO/ユーティリティを import して使う（スキーマ本体は `../quizzer-lib/prisma/schema.prisma`）。

| モジュール | ベースパス | 概要 |
|---|---|---|
| `quiz/` | `/quiz`, `/quiz/file` | 問題（基礎・応用・四択）の CRUD、出題形式別の問題取得（ランダム・低正解率・最小回答数・LRU・復習・今日未回答・直近更新）、問題検索（`/quiz/search`。カテゴリは `category_and`（すべて含む）・`category_not`（含まない）に JSON 文字列化したカテゴリ名の配列で指定）、正誤記録、問題統合、チェック・カテゴリの付け外し、CSV 一括登録（`/quiz/upload`: 基礎・応用、`/quiz/upload/fourchoice`: 四択。検証は `quiz/csv/`）、画像アップロード、画像の候補検索と取り込み（後述）、統計 |
| `category/` | `/category` | 問題カテゴリの一覧・正答率・親子関係・件数集計 |
| `english/` | `/english`, `/english/word`, `/english/derivatives` | 英単語帳（EnglishBot）: 単語/派生語/類義語/反意語/語源、例文とテスト、出典管理 |
| `saying/` | `/saying` | 格言（さやいん）の登録・検索・出典（書籍）管理、CSV 一括登録（`/saying/upload`。検証は `saying/csv/`） |
| `todo/` | `/todo` | ToDo とチェック状況、日記 |
| `auth/` | `/auth` | サインイン・新パスワード設定・アクセストークン再取得（`/auth/refresh`）・ログアウト（`/auth/logout`）。Cognito (`auth/cognito/`、AWS SDK v3) を用いたユーザー認証と、accessToken（JWT）の検証 (`CognitoAuthGuard`。失敗時は 401) |

各コントローラーが受け付ける具体的なエンドポイントは各 `*.controller.ts` を参照。ローカル起動時は Swagger UI が `http://localhost:4000/api` で閲覧できる。

- `quiz/` の更新・操作系 API（編集・統合・カテゴリの付け外し・チェックの付け外し）は、変更後の問題を返す（カテゴリ関連は有効なカテゴリ付き）。ファイル指定の回答ログ削除は削除件数（`{ count }`）を返す
- カテゴリ親子関係（`/category/parent-child`）の削除は論理削除（`deleted_at` を設定）。過去に削除した組み合わせを再度追加すると、そのレコードを復活させる（削除されていない同じ組み合わせがあれば 409）。追加時、子カテゴリが付いている問題に親カテゴリが付いていなければ親カテゴリも付与する
- 派生語の追加（`POST /english/word/derivative`）: 1 つの単語が属せる派生語グループは 1 つだけ。両単語の所属状況に応じて、既存グループへの追加・新規グループの作成・2 グループの統合（派生語側のグループの単語を元単語側のグループへ移し、空になったグループを削除）を行う。同じ単語同士、または既に同じグループに属している場合は 400
- 問題の参考画像の候補検索（`GET /quiz/image/candidates`、`quiz/image/search/`）: 問題文と答えから OpenAI Responses API の Web 画像検索で候補を探し、最大 9 件を返す。各候補には問題 ID・画像 URL に対する署名（HMAC、有効期限 1 時間）を付ける。OpenAI のクレジット不足・利用上限への到達（エラーの種類が `credit_balance_exhausted` / `insufficient_quota` / `billing_hard_limit_reached`）は 402、それ以外の失敗・タイムアウト（20 秒）は 502
- 候補の取り込み（`POST /quiz/image/import`、`quiz/image/import/`）: 署名を検証したうえで画像をダウンロードし（http(s) のみ、プライベート・ループバック・リンクローカル等のアドレスへは接続しない、リダイレクト 3 回・5MB・8 秒まで）、先頭バイトで PNG / JPEG / GIF / WebP / AVIF か判定して S3 に保存し、問題の `img_file` を更新する。元画像を取得できなければサムネイルで取り直し、どちらもだめなら 422。保存するファイル名は `auto_q<問題ID>_<日時>_<乱数>.<拡張子>`（手動アップロード `/quiz/image/upload` は元のファイル名のまま保存する）
- CSV 一括登録（問題・格言）は、登録前に全行を検証する。誤りが 1 件でもあれば 1 件も登録せず、`{ message, errors }`（`errors` は `3行目: 問題文が空です` のような行ごとの一覧）を 400 で返す。登録は各テーブルへまとめて書き込む。入力ファイルの形式は `../batch/README.md` を参照

### 認証

- サインイン成功時、accessToken はレスポンス本体で返し、refreshToken は HttpOnly Cookie（`quizzer_refresh_token`、`Path=/auth`、`SameSite=Lax`、有効期限6時間。`APP_ENV=local` 以外では `Secure`）にセットする
- `/auth/refresh` は Cookie の refreshToken で新しい accessToken を返す。refreshToken が無い・期限切れの場合は 401 を返し Cookie を削除する
- `/auth/logout` は Cognito の RevokeToken で refreshToken を無効化し、Cookie を削除する
- Cookie を送受信するため、CORS は `FRONT_ORIGIN` のオリジンのみ許可し、credentials を許可している（`src/main.ts`）

## セットアップ

```bash
# リポジトリルートで実行（pnpm workspace で一括インストール）
pnpm install
```

## 起動

```bash
# 開発（ホットリロードなし）
pnpm run start

# watch モード
pnpm run start:dev

# 本番相当
pnpm run start:prod
```

ローカル起動時はポート `4000` で待ち受ける（`APP_ENV=local` のときのみ `bootstrap()` が実行される）。

## テスト

```bash
# ユニットテスト
pnpm run test

# e2e テスト
pnpm run test:e2e

# カバレッジ
pnpm run test:cov
```

## Lint

```bash
pnpm run lint        # ESLint（Prettier の書式チェックを含む）。--fix 付きなので書式などは自動修正される
pnpm run lint:check  # --fix なしでチェックだけ行う（CI・pre-push フックでルートの pnpm lint から使う）
```

設定は `eslint.config.mjs`。ルールの方針はリポジトリルートの README の「Lint」を参照。

## 環境変数

ローカルで `pnpm run start:dev`（ルートの `pnpm start` / `pnpm start:backend` も同じ）で起動した場合、環境変数は次の 2 つのファイルから読み込まれる（値は各自の環境に合わせて設定。秘密情報のためリポジトリには含まれない）。

- `backend-nest/.env` — `src/main.ts` の `dotenv.config()` が読む（起動したディレクトリの `.env`）
- `quizzer-lib/.env` — `quizzer-lib` の Prisma クライアントが読み込む（`prisma/schema.prisma` と同じパッケージの `.env`）

リポジトリルートの `.env` は backend-nest からは読まれない。ルートの `docker-compose.yaml` でコンテナを起動する場合は、`DATABASE_URL` / `APP_ENV` / `REGION` / `AWS_COGNITO_USERPOOL_ID` / `AWS_COGNITO_APPCLIENT_ID` だけがルートの `.env` から渡される。Lambda では `infra/template.yaml` のパラメータから渡される。

| 変数 | ローカルでの置き場所 | 用途 |
|---|---|---|
| `APP_ENV` | `backend-nest/.env` | `local` のときのみ Express サーバーとして起動 |
| `REGION`, `AWS_COGNITO_USERPOOL_ID`, `AWS_COGNITO_APPCLIENT_ID` | `backend-nest/.env` | Cognito 認証まわり（`REGION` は S3 クライアントでも使う） |
| `DATABASE_URL` / `DIRECT_URL` | `quizzer-lib/.env` | Prisma 接続先 |
| `QUIZ_IMAGE_S3_BUCKET`, `AKEY`, `SAKEY` | `quizzer-lib/.env` | 問題画像の S3 保存・取得（`quizzer-lib` の `src/lib/aws/s3.ts`） |
| `OPENAI_API_KEY` | `backend-nest/.env` | 問題の参考画像の候補検索で使う OpenAI の API キー。Lambda には GitHub Secrets の `OPENAI_API_KEY` から `OpenAiApiKey` パラメータ経由で渡される |
| `OPENAI_IMAGE_SEARCH_MODEL` | `backend-nest/.env`（任意） | 画像の候補検索で使うモデル（未設定時は `gpt-6.2-sol`） |
| `QUIZ_IMAGE_SIGNING_SECRET` | `backend-nest/.env` | 画像の候補に付ける署名の秘密鍵（`openssl rand -hex 32` などで生成）。Lambda には GitHub Secrets の `QUIZ_IMAGE_SIGNING_SECRET` から渡される |
| `WORD_DERIVATIVES_FUNCTION_NAME` | — | 派生語取得で呼び出す Lambda 関数名（`english/derivatives/`） |
| `ENV` | — | ToDo チェック状況を保存する DynamoDB テーブル名 `<ENV>-todo-check-status` の接頭辞（未設定時は `dev`） |
| `FRONT_ORIGIN` | — | CORS で許可するフロントエンドのオリジン（未設定時は `http://localhost:3000`） |

## Docker

リポジトリルートの `Dockerfile` / `docker-compose.yaml` から本アプリのコンテナ (`quizzer_api`, ポート `4000`) をビルド・起動できる。
