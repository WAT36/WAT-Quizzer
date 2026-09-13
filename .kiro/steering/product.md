# WAT-Quizzer プロダクト概要

## 概要

**WAT-Quizzer** は個人向け学習支援 Web アプリケーション。npm workspaces によるモノレポ構成で管理されている。

## 主要機能

| 機能 | 説明 |
|---|---|
| **Quizzer（問題演習）** | クイズファイル単位で問題を管理・回答し、正答率・統計をグラフで確認する |
| **EnglishBot（英単語帳）** | 英単語の意味・例文・語源・派生語・類義語・対義語を管理し、テスト形式で学習する |
| **Saying（格言）** | 書籍などの格言を登録・閲覧する |
| **Todo** | シンプルな ToDo 管理（日記機能付き） |

## デプロイ構成

- **バックエンド**: AWS Lambda（コンテナイメージ）+ API Gateway
- **フロントエンド**: Next.js 静的エクスポート → S3 + CloudFront
- **モック環境**: `NEXT_PUBLIC_MOCK_MODE=true` で別 S3/CloudFront へデプロイ。バックエンドなしで E2E/Storybook テストが動作する
