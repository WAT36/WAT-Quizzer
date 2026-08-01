# frontend-next

WAT-Quizzer のフロントエンド。[Next.js](https://nextjs.org/)（Pages Router）製で、`next.config.js` で `output: 'export'` を指定した静的サイトとしてビルドされる（`infra` の `FrontendStack` から配信される想定）。

## 画面構成 (`src/pages/`)

| パス | 内容 |
|---|---|
| `/` | トップページ |
| `/login` | ログイン |
| `/settings` | 全体設定 |
| `/quizzer` 以下 | 問題（Quiz）機能: 一覧取得・追加・編集・削除・検索・画像アップロード・正答率グラフ・設定 |
| `/englishBot` 以下 | 英単語帳（EnglishBot）機能: トップ・単語追加・例文追加・単語詳細 (`detailWord/[id]`)・辞書検索・単語テスト |
| `/storybook` | Storybook への導線ページ |
| `/404` | 404 ページ |

`src/components/`（`ui-elements` / `ui-forms` / `ui-parts` / `templates` / `unused`）、`src/hooks/`、`src/contexts/`、`src/atoms/`（Recoil）、`src/utils/` に実装が分かれる。API 呼び出しやモックデータ、型は `../quizzer-lib`（backend-nest / batch と共有のパッケージ）を利用する。

## 主要ライブラリ

- UI: MUI (`@mui/material`, `@mui/x-data-grid`, `@mui/x-date-pickers`), Tailwind CSS
- 状態管理: Recoil
- グラフ/図: Chart.js・recharts（正答率グラフ等）、react-d3-tree（カテゴリツリー等）
- 認証: amazon-cognito-identity-js

## セットアップ

```bash
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できる。

## ビルド

```bash
npm run build   # 静的エクスポート (out/)
npm run serve   # ビルド後 out/ を配信
```

## テスト

- Storybook（コンポーネントカタログ + a11y チェック）:
  ```bash
  npm run storybook          # 開発サーバー (port 6006)
  npm run build-storybook
  npm run test-storybook     # Storybook のインタラクション/a11yテスト
  ```
  `chromatic` / `git:push` は Chromatic への Storybook 公開用。
- Playwright による e2e テスト (`e2e/`):
  ```bash
  npm run e2e
  npm run e2e:ui
  ```

## 環境変数

主に以下をリポジトリルートの `.env` で管理する。

- `NEXT_PUBLIC_API_SERVER` — 接続先の `backend-nest` API のベース URL
- `NEXT_PUBLIC_URL_END`, `QUIZZER_FRONT_SERVER` — フロント自身の URL 関連設定
