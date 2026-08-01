import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    // a11yチェックは .storybook/test-runner.ts の axe-playwright 側で一元管理する
    // (addon-a11y自体のsmoke-testでの自動失敗は無効化し、二重の合否判定を避ける)
    a11y: {
      test: 'off'
    }
  }
};

export default preview;
