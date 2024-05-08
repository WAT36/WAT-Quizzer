import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Container } from '@mui/material';
import { Title } from '@/components/ui-elements/title/Title';
import { LoginForm } from '@/components/ui-forms/login/loginForm/LoginForm';
import { useRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  isMock?: boolean;
};

// TODO 簡単にしすぎたのでもう少し書き換える
// TODO トップに戻るボタンも欲しい、というかレイアウト適用してメッセージ出させたい
export default function Login({ isMock }: Props) {
  const [message, setMessage] = useRecoilState(messageState);
  //   useEffect(() => {
  //     !isMock && Promise.all([getSayingAPI({ setSaying }), executeDbHealthCheck()]);
  //   }, [isMock]);

  return (
    <>
      <Head>
        <title>WAT Quizzer</title>
      </Head>
      <Container>
        <Title label="WAT Quizzer"></Title>
        <LoginForm setMessage={setMessage} />
      </Container>
    </>
  );
}
