import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Card } from '@/components/ui-elements/card/Card';
import { FormControl, FormGroup } from '@mui/material';
import { loginAPI } from '@/utils/api-wrapper';
import { isMockMode } from '@/utils/api-wrapper';

interface LoginFormProps {
  setShowNewPasswordForm: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const LoginForm = ({ setShowNewPasswordForm, username, setUsername }: LoginFormProps) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<String>('');

  const router = useRouter();

  const handleLogin = async () => {
    try {
      setMessage('通信中...');

      if (isMockMode()) {
        // モック環境では常にログイン成功
        setMessage('ログイン成功！');
        localStorage.setItem('idToken', 'mock-id-token');
        localStorage.setItem('accessToken', 'mock-access-token');
        router.push('/');
        return;
      }

      const res = await loginAPI({
        authSigninRequestData: {
          username,
          password
        }
      });
      // TODO 型定義する
      const data = res.result as any;

      if (data.status === 'SUCCESS') {
        setMessage('ログイン成功！');
        localStorage.setItem('idToken', data.idToken);
        localStorage.setItem('accessToken', data.accessToken);
        router.push('/');
      } else if (data.status === 'NEW_PASSWORD_REQUIRED') {
        setMessage('新しいパスワードが必要です');
        setShowNewPasswordForm(true);
      } else {
        setMessage('ログイン失敗: ' + data.error + ' - ' + data.message);
      }
    } catch (err: any) {
      setMessage('ログイン失敗: ' + err.message);
    }
  };

  return (
    <Card attr={['padding', 'rect-600']}>
      <FormGroup>
        <FormControl margin={'dense'}>
          <h1 className="text-center text-2xl font-bold">ログイン</h1>
        </FormControl>
        <FormControl margin={'dense'}>
          <TextField label={'ユーザー名'} id="username" value={username} setStater={setUsername} />
        </FormControl>
        <FormControl margin={'dense'}>
          <TextField type="password" id="password" label={'パスワード'} value={password} setStater={setPassword} />
        </FormControl>
        <FormControl margin={'dense'}>
          <Button variant={'outlined'} label={'ログイン'} onClick={handleLogin} />
        </FormControl>
        <p className="text-center text-gray-700 dark:text-gray-300">{message}</p>
      </FormGroup>
    </Card>
  );
};
