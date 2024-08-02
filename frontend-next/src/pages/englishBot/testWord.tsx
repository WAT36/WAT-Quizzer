import { Layout } from '@/components/templates/layout/Layout';
import { Container } from '@mui/material';
import { PullDownOptionState } from '../../../interfaces/state';
import { useEffect, useState } from 'react';
import { GetWordQueryForm } from '@/components/ui-forms/englishbot/testWord/getWordForm/GetWordQueryForm';
import { DisplayTestWordSection } from '@/components/ui-forms/englishbot/testWord/displayTestWordSection/DisplayTestWordSection';
import { Title } from '@/components/ui-elements/title/Title';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { getSourceListAPI } from '@/api/englishbot/getSourceListAPI';
import { GetEnglishWordTestDataAPIResponseDto } from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function TestWordPage({ isMock }: Props) {
  const setMessage = useSetRecoilState(messageState);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionState[]>([]);
  const [displayTestData, setDisplayTestData] = useState<GetEnglishWordTestDataAPIResponseDto>({});

  // 出典リスト取得
  useEffect(() => {
    !isMock && Promise.all([getSourceListAPI(setMessage, setSourcelistoption)]);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>
        <GetWordQueryForm sourcelistoption={sourcelistoption} setDisplayTestData={setDisplayTestData} />
        <DisplayTestWordSection displayTestData={displayTestData} setDisplayTestData={setDisplayTestData} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'単語テスト'} />
    </>
  );
}
