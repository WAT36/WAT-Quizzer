import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

// ESMで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', 'storybook-css-modules'],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  // Storybookでは実DB/実APIに繋がず、アプリ本体と同じモックモード（api-wrapper.ts の isMockMode）で描画する
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_MOCK_MODE: 'true'
  }),
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        // Next.jsフォントをモック
        'next/font/google': path.resolve(__dirname, '../.storybook/mocks/next-font-google.ts')
      };
      // @vitest/mockerをfallbackで無視
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@vitest/mocker': false,
        '@vitest/mocker/browser': false
      };
    }

    // Next.jsフォントローダーを完全に無効化（Storybookでは不要）
    // target.cssを含むリクエストを無視する
    if (config.module && config.module.rules) {
      const filterRule = (rule: any): any | null => {
        if (!rule) return rule;

        // Next.jsフォント関連のルールを除外
        if (rule.test) {
          const testStr = rule.test.toString();
          if (testStr.includes('target.css') || testStr.includes('next/font')) {
            return null; // ルールを削除
          }
        }

        // フォントローダーを含むルールをフィルタリング
        if (rule.use) {
          // useが配列かどうかを確認
          if (Array.isArray(rule.use)) {
            const filteredUse = rule.use.filter((loader: any) => {
              const loaderStr = typeof loader === 'string' ? loader : loader?.loader || '';
              return !loaderStr.includes('storybook-nextjs-font-loader') && !loaderStr.includes('next/font');
            });
            if (filteredUse.length === 0) {
              return null; // 使用するローダーがなくなったらルールを削除
            }
            return { ...rule, use: filteredUse };
          } else if (typeof rule.use === 'object' && rule.use !== null) {
            // useがオブジェクトの場合（単一のローダー）
            const loaderStr = typeof rule.use === 'string' ? rule.use : rule.use.loader || '';
            if (loaderStr.includes('storybook-nextjs-font-loader') || loaderStr.includes('next/font')) {
              return null; // フォントローダーの場合はルールを削除
            }
          } else if (typeof rule.use === 'string') {
            // useが文字列の場合
            if (rule.use.includes('storybook-nextjs-font-loader') || rule.use.includes('next/font')) {
              return null; // フォントローダーの場合はルールを削除
            }
          }
        }

        // oneOfルールを再帰的に処理
        if (rule.oneOf && Array.isArray(rule.oneOf)) {
          const filteredOneOf = rule.oneOf
            .map((oneOfRule: any) => filterRule(oneOfRule))
            .filter((r: any) => r !== null);
          return { ...rule, oneOf: filteredOneOf };
        }

        return rule;
      };

      config.module.rules = config.module.rules
        .map((rule: any) => filterRule(rule))
        .filter((rule: any) => rule !== null); // nullを削除
    }

    // target.cssを含むリクエストを無視するプラグインを追加
    if (!config.plugins) {
      config.plugins = [];
    }

    // NormalModuleReplacementPluginを使用してtarget.cssを無視
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /next\/font\/google\/target\.css/,
        path.resolve(__dirname, '../.storybook/mocks/empty.css')
      )
    );

    // @vitest/mockerをexternalとしてマーク（サーバー側とクライアント側の両方）
    const originalExternals = config.externals;
    config.externals = (data: any, callback: any) => {
      if (data.request === '@vitest/mocker' || data.request === '@vitest/mocker/browser') {
        return callback(null, 'commonjs ' + data.request);
      }
      if (typeof originalExternals === 'function') {
        return originalExternals(data, callback);
      }
      return callback();
    };

    // esbuildの設定も追加（@vitest/mockerを無視）
    if (!config.ignoreWarnings) {
      config.ignoreWarnings = [];
    }
    config.ignoreWarnings.push(/@vitest\/mocker/, /Could not resolve "@vitest\/mocker"/);

    return config;
  }
};
export default config;
