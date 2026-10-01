import '@/styles/globals.css';
import { useEffect, useMemo } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { themeModeState } from '@/atoms/ThemeMode';
import { createAppTheme } from '@/styles/theme';
import { ReauthModal } from '@/components/ui-forms/login/reauthModal/ReauthModal';

const ThemedApp = ({ Component, pageProps }: AppProps) => {
  const mode = useRecoilValue(themeModeState);
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
      {/* 認証切れ時にその場で再ログインさせるモーダル（全画面共通） */}
      <ReauthModal />
    </ThemeProvider>
  );
};

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <ThemedApp {...props} />
    </RecoilRoot>
  );
}
