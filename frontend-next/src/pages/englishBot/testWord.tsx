import { Layout } from '@/components/templates/layout/Layout';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { Title } from '@/components/ui-elements/title/Title';
import type { PullDownOptionDto, SourceApiResponse } from 'quizzer-lib';
import { apiResponsePullDownAdapter } from 'quizzer-lib';
import { getSourceListAPI } from '@/utils/api-wrapper';
import { RadioGroup } from '@/components/ui-parts/radioGroup/RadioGroup';
import { ENGLISH_TEST_TARGET, englishTestTargetRadioButton } from '@/constants/contents/radioButton';
import { WordTestSection } from '@/components/ui-forms/englishbot/testWord/WordTestSection/WordTestSection';
import { ExampleTestSection } from '@/components/ui-forms/englishbot/testWord/ExampleTestSection/ExampleTestSection';
import React from 'react';

type Props = {
  isMock?: boolean;
};

export default function TestWordPage({ isMock }: Props) {
  const [sourcelistoption, setSourcelistoption] = useState<PullDownOptionDto[]>([]);
  const [testType, setTestType] = useState<string>(ENGLISH_TEST_TARGET.WORD);

  // 出典リスト取得
  useEffect(() => {
    if (isMock) return;
    void (async () => {
      const result = await getSourceListAPI();
      result.result && setSourcelistoption(apiResponsePullDownAdapter(result.result as SourceApiResponse[]));
    })();
  }, [isMock]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - englishBot"></Title>
        <RadioGroup
          label="テスト："
          radioButtonProps={englishTestTargetRadioButton}
          defaultValue={ENGLISH_TEST_TARGET.WORD}
          onChange={(value: string) => {
            setTestType(value);
          }}
        />
        {testType === ENGLISH_TEST_TARGET.WORD ? (
          <WordTestSection sourcelistoption={sourcelistoption} />
        ) : (
          <ExampleTestSection sourcelistoption={sourcelistoption} />
        )}
      </Container>
    );
  };

  return <Layout mode="englishBot" contents={contents()} title={'単語テスト'} />;
}
