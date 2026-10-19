import nextConfig from 'eslint-config-next';
import storybookPlugin from 'eslint-plugin-storybook';
import prettierConfig from 'eslint-config-prettier';

const storybookConfigs = storybookPlugin.configs['flat/recommended'] ?? [];

const eslintConfig = [
  {
    ignores: ['.next/**', 'out/**', 'storybook-static/**', 'node_modules/**'],
  },
  ...nextConfig,
  ...storybookConfigs,
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      // 分割代入で一部のプロパティを取り除く書き方({ a: _a, ...rest })と、_で始まる未使用の引数・変数は許可する
      // 既存の違反が多い(100件超)ため、まずは警告にして少しずつ直す
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // 型情報を使うルール(tsconfig.json の対象になっている src/ のうち、Storyを除いたものだけが対象)
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: ['**/*.stories.ts', '**/*.stories.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      // onClick={async () => ...} のように、JSXの属性にasync関数を渡す書き方は許可する
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/switch-exhaustiveness-check': ['error', { considerDefaultExhaustiveForUnions: true }],
    },
  },
];

export default eslintConfig;
