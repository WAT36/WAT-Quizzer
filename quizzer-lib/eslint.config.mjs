import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

// TSLint(開発終了)の tslint:recommended から置き換えたもの
// 書式(インデント・クォートなど)のルールは含めない
export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'prisma/migrations/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node
    },
    rules: {
      // ApiResponse のように、継承元として中身のない interface を使っているため許可する
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'always' }
      ],
      // 引数のないAPI関数も ({}: Props) の形で呼び出し側と揃えているため許可する
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
      // 日本語のコメント中の全角スペースは許可する(文字列中はもともと対象外)
      'no-irregular-whitespace': ['error', { skipComments: true }]
    }
  }
)
