import { Layout } from '@/components/templates/layout/Layout';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Title } from '@/components/ui-elements/title/Title';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { apiResponsePullDownAdapter, getSourceListAPI, PullDownOptionDto, SourceApiResponse } from 'quizzer-lib';
import { RadioGroup } from '@/components/ui-parts/radioGroup/RadioGroup';
import { WordTestSection } from '@/components/ui-forms/englishbot/testWord/WordTestSection/WordTestSection';
import { ExampleTestSection } from '@/components/ui-forms/englishbot/testWord/ExampleTestSection/ExampleTestSection';
import React from 'react';

type Props = {
  isMock?: boolean;
};

export default function TestWordPage({ isMock }: Props) {
  const setMessage = useSetRecoilState(messageState);
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionDto[]>([]);
  const [testType, setTestType] = useState<string>('0');

  // 出典リスト取得
  useEffect(() => {
    !isMock &&
      Promise.all([
        (async () => {
          const result = await getSourceListAPI();
          result.result && setSourcelistoption(apiResponsePullDownAdapter(result.result as SourceApiResponse[]));
        })()
      ]);
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>
        <>
          {/**TODO RadioGroup ラベルの要素入れたい　あと中のqueryOfQuiz も名前変えたい */}
          テスト：
          <RadioGroup
            radioButtonProps={[
              {
                value: '0',
                label: 'Word'
              },
              {
                value: '1',
                label: 'Example'
              }
            ]}
            defaultValue={'0'}
            setQueryofQuizStater={(value: string) => {
              setTestType(value);
            }}
          />
        </>
        {testType === '0' ? <WordTestSection sourcelistoption={sourcelistoption} /> : <ExampleTestSection />}
      </Container>
    );
  };

  return <Layout mode="englishBot" contents={contents()} title={'単語テスト'} />;
}
