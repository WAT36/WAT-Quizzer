import '@/styles/globals.css';
import { useEffect, useMemo } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { themeModeState } from '@/atoms/ThemeMode';
import { createAppTheme } from '@/styles/theme';

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
