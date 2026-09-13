# 技術スタック

## フロントエンド（`frontend-next/`）

- **フレームワーク**: Next.js v16（Pages Router、静的エクスポート `output: export`）
  - **注意**: このプロジェクトは Next.js v16 を使用しており、トレーニングデータの知識と異なる破壊的変更がある可能性がある。フロントエンドのコードを書く前に `node_modules/next/dist/docs/` （ルートの `node_modules/next/dist/docs/`）の関連ガイドを確認すること
  - Pages Router を使用。App Router は使用していない
- **UIライブラリ**: MUI (Material UI) v5 + Tailwind CSS v4
- **状態管理**: Recoil v0.7（ThemeMode / Message / SideBar の 3 atom のみ）
- **データフェッチ**: axios + `quizzer-lib` の API クライアント
- **テーブル**: @tanstack/react-table v8、@mui/x-data-grid v6
- **グラフ**: chart.js v4 + react-chartjs-2、recharts v3
- **テスト**: Playwright（E2E）、Storybook v10（インタラクション + a11y）、Chromatic
- **言語**: TypeScript v5.8

## バックエンド（`backend-nest/`）

- **フレームワーク**: NestJS v11（Express アダプター）
- **ORM**: Prisma（スキーマは `quizzer-lib/prisma/schema.prisma` で一元管理）
- **認証**: AWS Cognito（`aws-jwt-verify` で JWT 検証、`CognitoAuthGuard` で NestJS Guard パターン）
- **AWS SDK**: DynamoDB、Lambda、S3、Secrets Manager、Cognito Identity Provider（@aws-sdk v3 系）
- **API仕様書**: Swagger（`/api` エンドポイント）
- **ポート**: 4000
- **デプロイ形態**: `aws-serverless-express` で Lambda ハンドラとしてラップ。`APP_ENV=local` 時のみローカル `bootstrap()` が実行される
- **言語**: TypeScript v5.8

## データベース

- **PostgreSQL**（Prisma Accelerate 対応のため `DATABASE_URL` と `DIRECT_URL` の 2 URL 設定）
- 全テーブルに `created_at` / `updated_at` / `deleted_at` → 論理削除パターンを採用
- 集計用 DB ビューを Prisma の `views` プレビュー機能で管理

## 共有ライブラリ（`quizzer-lib/`）

- Prisma スキーマ・共通型定義（DTO）・API クライアント（axios ラッパー）・ユーティリティを `backend-nest` / `frontend-next` / `batch` の 3 パッケージで共有
- `index.ts` からエクスポート

## インフラ（`infra/`）

- **AWS CDK** v2（`BackendStack`、`FrontendStack`、`MockStack`）
- SAM も併用（`template.yaml` / `samconfig.toml`）
- **CI/CD**: GitHub Actions（`develop` ブランチへの push をトリガー）
- npm workspace には含まれない独立プロジェクト

## コードスタイル

### Prettier（ルート `.prettierrc`）
```json
{
  "semi": false,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 80
}
```

### ESLint
- **バックエンド**: `@typescript-eslint/recommended` + `prettier/recommended`。`no-explicit-any` は off（any 型許容）
- **フロントエンド**: `eslint-config-next` + `eslint-plugin-storybook` + `eslint-config-prettier`（フラット設定形式）

### TypeScript
- `"strict": true`（厳格モード）
- `"target": "es2016"`, `"module": "commonjs"`

### 命名規則
- ファイル名: ケバブケース（バックエンド）、キャメルケース（フロントエンドページ）
- クラス名・コンポーネント名: PascalCase
- 変数・関数: camelCase
- DB モデル・カラム: スネークケース（`quiz_id`, `created_at` 等）

## コマンド一覧

### ルート（モノレポ全体）
```bash
npm run start              # quizzer-lib ビルド後、backend + frontend を同時起動
npm run build:lib          # quizzer-lib のみビルド
npm run build:backend      # prisma generate → nest build
npm run build:frontend     # next build（静的エクスポート）
npm run deps:check         # workspace 間バージョン不整合チェック（syncpack）
npm run deps:fix           # 上記の自動修正
```

### バックエンド（`backend-nest/` で実行）
```bash
npm run start:dev          # watch モードで起動
npm run build              # nest build
npm run test               # Jest 単体テスト
npm run test:cov           # カバレッジ付きテスト
npm run test:e2e           # E2E テスト
npm run lint               # ESLint（--fix 付き）
npm run format             # Prettier
```

### フロントエンド（`frontend-next/` で実行）
```bash
npm run dev                # 開発サーバー
npm run export             # next build（静的エクスポート）
npm run e2e                # モックモードビルド → Playwright E2E
npm run storybook          # Storybook 開発サーバー（port 6006）
npm run build-storybook    # Storybook ビルド
npm run test-storybook     # Storybook テスト（インタラクション + a11y）
npm run lint               # next lint
```

### Docker（ローカル）
```bash
docker-compose up          # API コンテナ（port 4000）起動
```
