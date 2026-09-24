# WAT-Quizzer モック環境

## 概要

WAT-Quizzer のモック環境は、外部の人が参考用に見るための環境です。認証は不要で、すべての画面にアクセス可能ですが、サンプルデータのみを使用します。

## 特徴

- **認証不要**: すべての画面にログインなしでアクセス可能
- **サンプルデータ**: 実際のデータベースにはアクセスせず、サンプルデータのみ表示
- **完全分離**: 本番環境のデータには一切アクセスしない
- **自動デプロイ**: develop ブランチに push されると自動的にデプロイ

## アーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │────│   S3 Bucket    │────│  Static Files   │
│   Distribution   │    │  (Static Host) │    │  (Next.js)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 環境変数

モック環境では以下の環境変数が設定されます：

- `NEXT_PUBLIC_MOCK_MODE=true`: モックモードを有効化
- `NODE_ENV=production`: 本番環境としてビルド

## デプロイ

### 自動デプロイ

develop ブランチに push すると、GitHub Actions が自動的に以下を実行します：

1. フロントエンドのビルド（モックモード有効）
2. AWS CDK でモックスタックのデプロイ
3. S3 への静的ファイルアップロード
4. CloudFront キャッシュの無効化

## ローカル開発

モックモードでローカル開発を行う場合：

```bash
cd frontend-next
NEXT_PUBLIC_MOCK_MODE=true pnpm run dev
```

## サンプルデータ

モック環境では以下のサンプルデータが使用されます：

- **クイズデータ**: プログラミング、AWS、データベース関連の問題
- **英語データ**: IT 関連の英単語と例文
- **格言データ**: 英語のことわざと名言

## アクセス方法

モック環境の URL は、デプロイ後に CloudFormation の出力から確認できます：

```bash
aws cloudformation describe-stacks --stack-name MockStack --query 'Stacks[0].Outputs[?OutputKey==`MockWebsiteURL`].OutputValue' --output text
```

## トラブルシューティング

### よくある問題

1. **ビルドエラー**: `NEXT_PUBLIC_MOCK_MODE=true`が設定されているか確認
2. **デプロイエラー**: AWS 認証情報が正しく設定されているか確認
3. **アクセスできない**: CloudFront の配信完了まで数分待つ

### ログ確認

```bash
# CloudFormationスタックの状態確認
aws cloudformation describe-stacks --stack-name MockStack

# CloudFrontの配信状況確認
aws cloudfront get-distribution --id <DISTRIBUTION_ID>
```

## セキュリティ

- モック環境は本番データにアクセスしません
- 認証は完全に無効化されています
- サンプルデータのみを使用します
