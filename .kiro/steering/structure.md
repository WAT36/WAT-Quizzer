# プロジェクト構造

## モノレポ構成（npm workspaces）

```
WAT-Quizzer/
├── backend-nest/          # NestJS REST API サーバー
├── frontend-next/         # Next.js フロントエンド（静的エクスポート）
├── quizzer-lib/           # 共有パッケージ（backend-nest / frontend-next / batch が依存）
├── batch/                 # 単発実行バッチ・CLI スクリプト集
├── infra/                 # AWS CDK インフラ定義（npm workspace 外の独立プロジェクト）
└── container/             # ローカル用 PostgreSQL コンテナ（docker-compose）
```

---

## バックエンド（`backend-nest/src/`）

NestJS 標準のモジュール分割。`controller`（HTTP ルーティング）→ `service`（ビジネスロジック + Prisma クエリ）の 2 層構成。一部 `pipes/` でバリデーションパイプを持つ。

```
src/
├── app.module.ts          # ルートモジュール（全モジュールをインポート）
├── main.ts                # Lambda handler + ローカル bootstrap（APP_ENV=local 時のみ実行）
├── constants.ts
├── auth/                  # 認証（CognitoAuthGuard）
│   └── cognito/           # Cognito JWT 検証ロジック
├── quiz/                  # クイズ機能
│   ├── file/              # クイズファイル管理
│   └── pipe/              # バリデーションパイプ
├── category/              # カテゴリ管理
│   └── pipes/
├── english/               # 英単語 Bot
│   ├── word/              # 単語管理
│   └── derivatives/       # 派生語管理
├── saying/                # 格言
└── todo/                  # ToDo
```

---

## フロントエンド（`frontend-next/src/`）

Next.js Pages Router ベース。`/quizzer/*` と `/englishBot/*` の 2 大機能ルートに分割。

```
src/
├── pages/
│   ├── _app.tsx           # RecoilRoot + MUI ThemeProvider（グローバル設定）
│   ├── login.tsx
│   ├── settings.tsx
│   ├── quizzer/           # クイズ機能ページ群
│   └── englishBot/        # 英単語 Bot ページ群
├── components/
│   ├── templates/         # ページ単位・レイアウトコンポーネント
│   ├── ui-elements/       # 汎用 UI 部品（最小粒度）
│   ├── ui-forms/          # フォーム系コンポーネント
│   └── ui-parts/          # 複合 UI コンポーネント
├── atoms/                 # Recoil atom（ThemeMode / Message / SideBar の 3 つのみ）
├── hooks/                 # カスタムフック（データフェッチ状態管理）
├── contexts/              # React Context
├── constants/             # 定数
├── styles/                # グローバルスタイル・テーマ定義
└── utils/                 # ユーティリティ
```

---

## 共有ライブラリ（`quizzer-lib/`）

```
quizzer-lib/
├── prisma/
│   └── schema.prisma      # 全 DB モデル定義（PostgreSQL）。ここが唯一の正規スキーマ
└── src/
    ├── api/               # API クライアント（axios ラッパー）+ DTO
    ├── common/
    ├── constant/
    └── lib/
```

---

## インフラ（`infra/lib/stack/`）

```
infra/lib/stack/
├── backend-stack.ts       # Lambda（コンテナイメージ）+ API Gateway
├── frontend-stack.ts      # S3 + CloudFront（静的エクスポート配信）
└── mock-stack.ts          # モック環境用 S3 + CloudFront
```

---

## 主要な設計上の規約

- **DB スキーマの一元管理**: Prisma スキーマは `quizzer-lib/prisma/schema.prisma` のみ。backend-nest や batch から参照する
- **論理削除**: 全テーブルに `deleted_at` カラム。物理削除は原則使用しない
- **API クライアントの共有**: フロントエンドは `quizzer-lib` の axios ラッパーを経由してバックエンドを呼び出す
- **モックモード**: `NEXT_PUBLIC_MOCK_MODE=true` でバックエンドなしのテストが可能。E2E・Storybook テストで活用
- **コンポーネント分類**: `ui-elements`（汎用）→ `ui-parts`（複合）→ `ui-forms`（フォーム）→ `templates`（ページ単位）の階層構造
