# infra

WAT-Quizzer の AWS インフラを定義する [AWS CDK](https://aws.amazon.com/cdk/)（TypeScript）プロジェクト。pnpm workspace には含まれず、独立した CDK アプリとして npm で管理する（`infra/` で `npm install`）。

## エントリーポイント (`bin/`)

- `infra.ts` — 本番用の全スタックを定義・依存関係を設定する:
  - `DnsStack`（`lib/stack/usEast1/dns-stack.ts`）— Route53 ホストゾーン
  - `CertificateStack`（`lib/stack/usEast1/certificate-stack.ts`）— ACM 証明書（us-east-1）
  - `BackendStack`（`lib/stack/backend-stack.ts`）— `backend-nest` 用インフラ
  - `FrontendStack`（`lib/stack/frontend-stack.ts`）— `frontend-next` の静的サイト配信用インフラ（S3 バケット等。`BackendStack` の `todoCheckStatusTable` を参照）と、Cognito（ユーザープール・アプリクライアント・ID プール）。アプリクライアントのトークン有効期限は accessToken / idToken 1時間、refreshToken 6時間
  - `UsEast1Stack`（`lib/stack/us-east1-stack.ts`）— us-east-1 リージョン依存のリソース（CloudFront 用証明書と連携）
  - `MockStack`（`lib/stack/mock-stack.ts`）— モック環境用スタック
- `mock-infra.ts` — `MockStack` のみをデプロイする、モック/ローカル確認用の簡易エントリーポイント

## 補助リソース (`lib/service/`)

- `route53.ts`, `iam.ts` — Route53 / IAM まわりの共通処理
- `lambda-edge/cognito-at-edge/` — CloudFront (Lambda@Edge) 上で Cognito 認証を行う Lambda 関数（現在はどのスタックからも参照されていない）

## API（SAM, `template.yaml`）

`backend-nest` の API は CDK ではなく AWS SAM（`template.yaml` / `samconfig.toml`）でデプロイする。`BackendStack` は `SAM_APIGATEWAY_ID` でこの API Gateway を参照する。

- `ApiGatewayRestApi` — API Gateway（カスタムドメイン `QuizzerApiDomainName`）。CORS は `FrontOrigin` パラメータのオリジンのみ許可し、credentials（Cookie）を許可する
- `SamQuizzerApiFunction` — `backend-nest` を動かす Lambda（リポジトリルートの `Dockerfile` からビルドするコンテナイメージ。`/{proxy+}` の全メソッドを受ける）
- `WordDerivativesFunction` — 下記 `lambda/word-derivatives/` の Lambda

develop ブランチへの push で `.github/workflows/develop.yml` が `sam build` / `sam deploy` を実行する（パラメータは同ワークフローの `--parameter-overrides` を参照）。

## Lambda (`lambda/`)

- `word-derivatives/`（Python, `app.py` + `requirements.txt`）— 単語の派生語を扱う Lambda 関数

## Useful commands

* `npm run build` — TypeScript をコンパイル
* `npm run watch` — 変更を監視してコンパイル
* `npm run test` — jest による unit test
* `npx cdk deploy --context env=<env>` — 対象環境へデプロイ（`env` コンテキストで環境を切り替える。`bin/infra.ts` が `app.node.tryGetContext('env')` を参照）
* `npx cdk diff --context env=<env>` — デプロイ済みスタックとの差分確認
* `npx cdk synth --context env=<env>` — CloudFormation テンプレートを出力
