import { post } from '@/api/API';
import { LoginState, MessageState } from '../../../interfaces/state';
import { ProcessingApiSingleReponse } from 'quizzer-lib';

interface SignInButtonProps {
  loginState: LoginState;
  setLoginState?: React.Dispatch<React.SetStateAction<LoginState>>;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
}

// TODO  libに持っていく
interface SignInResponseDto {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

// TODO 簡単nに書きすぎたのでもう少し処理加えよう
export const signInAPI = async ({ loginState, setLoginState, setMessage }: SignInButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setLoginState || !setMessage) {
    return;
  }

  // 送信データ作成
  // TODO password送信について
  const sendData: { [key: string]: string } = {
    username: loginState.username,
    password: loginState.password
  };

  setMessage({
    message: '通信中...',
    messageColor: '#d3d3d3',
    isDisplay: true
  });
  await post('/auth/signin', sendData, (data: ProcessingApiSingleReponse) => {
    if (data.status === 200 || data.status === 201) {
      const res: SignInResponseDto = data.body as SignInResponseDto;
      setMessage({
        message: 'Success!',
        messageColor: 'success.light',
        isDisplay: true
      });
      setLoginState({
        username: '',
        password: ''
      });
      // TODO local用の処理 残す？書き換える？
      if (process.env.NEXT_PUBLIC_APP_ENV === 'local') {
        localStorage.setItem('apiAccessToken', res.accessToken);
        localStorage.setItem('apiIdToken', res.idToken);
        localStorage.setItem('apiRefreshToken', res.refreshToken);
      }
    } else {
      setMessage({
        message: `認証エラー(${data.status})`,
        messageColor: 'error',
        isDisplay: true
      });
    }
  }).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessage({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};
