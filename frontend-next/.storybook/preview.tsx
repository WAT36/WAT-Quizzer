import type { Preview } from '@storybook/react';
import React, { useEffect, useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme } from '@/styles/theme';
import type { ThemeMode } from '@/atoms/ThemeMode';
import '../src/styles/globals.css';

// ツールバーの Theme 切り替えに合わせて、MUIテーマ(palette.mode)とTailwindのdarkクラスの両方を切り替える
const ThemeDecorator = ({ mode, children }: { mode: ThemeMode; children: React.ReactNode }) => {
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

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
  },
  globalTypes: {
    theme: {
      description: 'ライト/ダークモード切り替え',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' }
        ],
        dynamicTitle: true
      }
    }
  },
  decorators: [
    (Story, context) => (
      <ThemeDecorator mode={context.globals.theme === 'dark' ? 'dark' : 'light'}>
        <Story />
      </ThemeDecorator>
    )
  ]
};

export default preview;
