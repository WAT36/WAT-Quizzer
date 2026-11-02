import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { authNewPasswordSigninAPI } from 'quizzer-lib';
import type { SignInResult } from 'quizzer-lib';
import { LAST_USERNAME_STORAGE_KEY } from '@/constants/auth';

interface NewPasswordFormProps {
  username: string;
  // サインイン時にNEW_PASSWORD_REQUIREDと一緒に返されたsession
  session: string;
}

export const NewPasswordForm = ({ username, session }: NewPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<String>('');

  const router = useRouter();

  const handleNewPasswordSubmit = async () => {
    if (!username || username === '') return;

    try {
      const res = await authNewPasswordSigninAPI({
        authSigninRequestData: {
          username,
          password: newPassword,
          session
        }
      });
      const data = res.result as SignInResult | undefined;

      // accessTokenの保持はauthNewPasswordSigninAPI内で行われる
      if (data?.status === 'SUCCESS') {
        localStorage.setItem(LAST_USERNAME_STORAGE_KEY, username);
        void router.push('/');
      } else {
        // 200以外のときはエラー内容のbodyが返る
        const errorBody = res.result as { error?: string; message?: string } | undefined;
        setMessage('不明な応答が返されました' + errorBody?.error + ' - ' + errorBody?.message);
      }
    } catch (err: any) {
      console.error(err);
      setMessage('パスワード変更失敗: ' + err.message);
    }
  };
  return (
    <Card attr={['padding', 'rect-600']}>
      <h1>新しいパスワードでログイン</h1>
      <TextField
        type="password"
        id="newPassword"
        label={'新しいパスワード'}
        value={newPassword}
        setStater={setNewPassword}
      />
      <Button label={'パスワード変更してログイン'} onClick={handleNewPasswordSubmit} />
      <p>{message}</p>
    </Card>
  );
};
