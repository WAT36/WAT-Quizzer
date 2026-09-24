// syncpack.config.cjs
module.exports = {
  // ^ に揃えるとか
  semverRange: '^',
  // バージョン揃えの対象パッケージ（よく共通化したいもの）
  packages: [
    'package.json',
    'frontend-next/package.json',
    'backend-nest/package.json',
    'quizzer-lib/package.json',
    'batch/package.json'
  ],
  versionGroups: [
    {
      // ワークスペース内パッケージ（quizzer-lib）は pnpm の workspace プロトコルで参照する
      label: 'ワークスペース内パッケージ',
      dependencies: ['$LOCAL'],
      dependencyTypes: ['prod', 'dev'],
      pinVersion: 'workspace:*'
    }
  ]
}
