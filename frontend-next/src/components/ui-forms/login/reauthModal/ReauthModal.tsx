import { useEffect, useRef, useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { setReauthHandler, SignInResult } from 'quizzer-lib';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Button } from '@/components/ui-elements/button/Button';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { loginAPI } from '@/utils/api-wrapper';
import { LAST_USERNAME_STORAGE_KEY } from '@/constants/auth';

// 認証切れ（ログインから約6時間経過など）でAPIが失敗した時に、画面を移動せずその場で再ログインさせるモーダル
// 再ログインに成功すると、失敗していたAPIリクエストが再送される
export const ReauthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const resolverRef = useRef<((succeeded: boolean) => void) | null>(null);

  useEffect(() => {
    setReauthHandler(
      () =>
        new Promise<boolean>((resolve) => {
          resolverRef.current = resolve;
          setUsername(localStorage.getItem(LAST_USERNAME_STORAGE_KEY) || '');
          setPassword('');
          setMessage('認証の有効期限が切れました。再度ログインしてください');
          setIsOpen(true);
        })
    );
    return () => setReauthHandler(null);
  }, []);

  const close = (succeeded: boolean) => {
    setIsOpen(false);
    setPassword('');
    resolverRef.current?.(succeeded);
    resolverRef.current = null;
  };

  const handleLogin = async () => {
    setMessage('通信中...');
    // accessTokenの保持はloginAPI内で行われる
    const res = await loginAPI({ authSigninRequestData: { username, password } });
    const data = res.result as SignInResult | undefined;

    if (data?.status === 'SUCCESS') {
      localStorage.setItem(LAST_USERNAME_STORAGE_KEY, username);
      close(true);
    } else if (data?.status === 'NEW_PASSWORD_REQUIRED') {
      setMessage('パスワードの変更が必要です。ログイン画面からログインしてください');
    } else {
      setMessage('ログインに失敗しました。ユーザー名とパスワードを確認してください');
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="p-6">
        <FormGroup>
          <FormControl margin={'dense'}>
            <h2 className="text-center text-xl font-bold">再ログイン</h2>
          </FormControl>
          <FormControl margin={'dense'}>
            <TextField label={'ユーザー名'} id="reauth-username" value={username} setStater={setUsername} />
          </FormControl>
          <FormControl margin={'dense'}>
            <TextField
              type="password"
              id="reauth-password"
              label={'パスワード'}
              value={password}
              setStater={setPassword}
            />
          </FormControl>
          <FormControl margin={'dense'}>
            <Button variant={'outlined'} label={'ログイン'} onClick={handleLogin} />
          </FormControl>
          <FormControl margin={'dense'}>
            <Button variant={'text'} color={'inherit'} label={'キャンセル'} onClick={() => close(false)} />
          </FormControl>
          <p className="text-center text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </FormGroup>
      </div>
    </Modal>
  );
};
