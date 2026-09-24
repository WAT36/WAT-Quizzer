import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';

type Props = {};

export default function Storybook({}: Props) {
  const [storybookUrl, setStorybookUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 開発環境と本番環境で異なるURLを使用
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // ローカル環境: Storybookの開発サーバー（通常はポート6006）
      // ※ローカルの場合は別途pnpm run storybookも実行しておくこと
      const devUrl = process.env.NEXT_PUBLIC_STORYBOOK_URL || '';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorybookUrl(devUrl);
      setIsLoading(false);

      // Storybookサーバーが起動しているか確認（オプション）
      fetch(devUrl, { mode: 'no-cors' }).catch(() => {
        setError(`Storybookサーバーに接続できません。${devUrl} でStorybookが起動していることを確認してください。`);
      });
    } else {
      // dev環境: ビルド済みのStorybookを静的ファイルとして配信
      // storybook-staticディレクトリの内容をpublic/storybookに配置することを想定
      // または、環境変数でカスタムURLを指定可能
      const prodUrl = process.env.NEXT_PUBLIC_STORYBOOK_URL || '';
      setStorybookUrl(prodUrl);
      setIsLoading(false);
    }
  }, []);

  const content = (
    <Box sx={{ width: '100%', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Storybook
        </Typography>
        {process.env.NODE_ENV === 'development' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Storybookの開発サーバーが起動していることを確認してください。
            <br />
            起動していない場合は、<code>pnpm run storybook</code>を実行してください。
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      {!isLoading && storybookUrl && (
        <Box
          component="iframe"
          src={storybookUrl}
          sx={{
            width: '100%',
            height: '100%',
            border: 'none',
            flex: 1,
            minHeight: '600px'
          }}
          onError={() => setError('Storybookの読み込みに失敗しました。')}
        />
      )}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography>読み込み中...</Typography>
        </Box>
      )}
    </Box>
  );

  return <Layout mode="top" contents={content} title="Storybook" isProtected={true} />;
}
