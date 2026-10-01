# frontend-next

WAT-Quizzer のフロントエンド。[Next.js](https://nextjs.org/)（Pages Router）製で、`next.config.js` で `output: 'export'` を指定した静的サイトとしてビルドされる（`infra` の `FrontendStack` から配信される想定）。

## 画面構成 (`src/pages/`)

| パス | 内容 |
|---|---|
| `/` | トップページ |
| `/login` | ログイン |
| `/settings` | 全体設定 |
| `/quizzer` 以下 | 問題（Quiz）機能: 出題（`getQuiz`。出題設定で条件・出題形式・出題数を指定して連続出題し、終了後に正解率とカテゴリ別の得意/苦手を表示）・追加・編集・削除・検索・画像アップロード・正答率グラフ・設定 |
| `/englishBot` 以下 | 英単語帳（EnglishBot）機能: トップ・単語追加・例文追加・単語詳細 (`detailWord/[id]`)・辞書検索・単語テスト |
| `/storybook` | Storybook への導線ページ |
| `/404` | 404 ページ |

`src/components/`（`ui-elements` / `ui-forms` / `ui-parts` / `templates` / `unused`）、`src/hooks/`、`src/contexts/`、`src/atoms/`（Recoil）、`src/utils/` に実装が分かれる。API 呼び出しやモックデータ、型は `../quizzer-lib`（backend-nest / batch と共有のパッケージ）を利用する。

## 主要ライブラリ

- UI: MUI (`@mui/material`, `@mui/x-data-grid`, `@mui/x-date-pickers`), Tailwind CSS
- 状態管理: Recoil
- グラフ/図: Chart.js・recharts（正答率グラフ等）、react-d3-tree（カテゴリツリー等）

## 認証

- accessToken はメモリにのみ保持し、refreshToken は API（`backend-nest`）が HttpOnly Cookie で管理する。トークン管理の実体は `quizzer-lib` の `src/api/auth/token.ts`
- 画面表示時に `RequiredAuthComponent` が1回だけ認証状態を確認する。リロード直後などメモリにトークンが無い場合は `/auth/refresh` で取り直し、失敗したら `/login` へ移動する
- API 呼び出し時に accessToken が期限切れ（または期限間近）なら自動で再取得する。refreshToken も期限切れの場合は、画面を移動せずに再ログインモーダル（`src/components/ui-forms/login/reauthModal/ReauthModal.tsx`、`_app.tsx` に配置）を表示し、ログイン成功後に失敗したリクエストを再送する
- 再ログインモーダルでユーザー名を入力済みにするため、最後にログインしたユーザー名を localStorage（`lastUsername`）に保存する

## セットアップ

```bash
# リポジトリルートで実行（pnpm workspace で一括インストール）
pnpm install
```

## 開発サーバー起動

```bash
pnpm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できる。

## ビルド

```bash
pnpm run build        # 静的エクスポート (out/)。export も同じ内容
pnpm run serve        # ビルド後 out/ を配信
pnpm run export:mock  # モックモード（NEXT_PUBLIC_MOCK_MODE=true）で静的エクスポート
```

モックモードでは API を呼ばずにサンプルデータを表示する（`src/utils/api-wrapper.ts`）。モック環境の詳細はリポジトリルートの `MOCK-README.md` を参照。

## テスト

- Storybook（コンポーネントカタログ + a11y チェック）:
  ```bash
  pnpm run storybook          # 開発サーバー (port 6006)
  pnpm run build-storybook
  pnpm run test-storybook     # Storybook のインタラクション/a11yテスト
  pnpm run test-storybook:report  # 上記の結果を test-result/a11y.json に出力
  ```
  Storybook では `.storybook/main.ts` で `NEXT_PUBLIC_MOCK_MODE=true` が設定され、モックデータで表示される。`chromatic` / `git:push` は Chromatic への Storybook 公開用。
- Playwright による e2e テスト (`e2e/`)。モックモードでエクスポートした静的サイトに対して実行する:
  ```bash
  pnpm run e2e                          # export:mock → playwright test
  pnpm run e2e:ui
  pnpm run e2e:check-coverage-baseline  # e2e/coverage-baseline.json との比較
  ```

## 環境変数

主に以下を `frontend-next/.env` で管理する。

- `NEXT_PUBLIC_API_SERVER` — 接続先の `backend-nest` API のベース URL
- `NEXT_PUBLIC_URL_END` — フロント自身の URL 関連設定
- `NEXT_PUBLIC_STORYBOOK_URL` — `/storybook` ページから遷移する Storybook の URL
- `NEXT_PUBLIC_MOCK_MODE` — `true` のときモックモード（通常は `export:mock` や Storybook 側で設定）
