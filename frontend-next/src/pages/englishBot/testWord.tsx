import { Layout } from '@/components/templates/layout/Layout';
import { Container } from '@mui/material';
import { useState } from 'react';
import { Title } from '@/components/ui-elements/title/Title';
import { useSourceList } from '@/hooks/useSourceList';
import { RadioGroup } from '@/components/ui-parts/radioGroup/RadioGroup';
import { ENGLISH_TEST_TARGET, englishTestTargetRadioButton } from '@/constants/contents/radioButton';
import { WordTestSection } from '@/components/ui-forms/englishbot/testWord/WordTestSection/WordTestSection';
import { ExampleTestSection } from '@/components/ui-forms/englishbot/testWord/ExampleTestSection/ExampleTestSection';
import React from 'react';

type Props = {
  isMock?: boolean;
};

export default function TestWordPage({ isMock }: Props) {
  const { sourceList } = useSourceList(isMock);
  const [testType, setTestType] = useState<string>(ENGLISH_TEST_TARGET.WORD);

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
          <WordTestSection sourcelistoption={sourceList} />
        ) : (
          <ExampleTestSection sourcelistoption={sourceList} />
        )}
      </Container>
    );
  };

  return <Layout mode="englishBot" contents={contents()} title={'単語テスト'} />;
}
