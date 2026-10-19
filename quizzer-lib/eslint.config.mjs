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
    }
  }
)
