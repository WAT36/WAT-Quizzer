import React from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import type { GetEnglishWordTestDataAPIResponseDto } from 'quizzer-lib';
import { WORD_TEST_TYPE } from 'quizzer-lib';
import { NameTestContent } from '../nameTestContent/NameTestContent';
import { FourChoiceTestContent } from '../fourChoiceTestContent/FourChoiceTestContent';
import { MeaningTestContent } from '../meaningTestContent/MeaningTestContent';

interface DisplayTestWordSectionProps {
  displayTestData: GetEnglishWordTestDataAPIResponseDto;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetEnglishWordTestDataAPIResponseDto>>;
}

// 出題された単語を、テスト形式に応じた表示で出す
export const DisplayTestWordSection = ({ displayTestData, setDisplayTestData }: DisplayTestWordSectionProps) => {
  return (
    <Card variant="outlined">
      {displayTestData.testType === String(WORD_TEST_TYPE.NAME) ? (
        <NameTestContent displayTestData={displayTestData} setDisplayTestData={setDisplayTestData} />
      ) : displayTestData.testType === String(WORD_TEST_TYPE.FOUR_CHOICE) ? (
        <FourChoiceTestContent displayTestData={displayTestData} setDisplayTestData={setDisplayTestData} />
      ) : displayTestData.testType === String(WORD_TEST_TYPE.MEANING) ? (
        <MeaningTestContent displayTestData={displayTestData} setDisplayTestData={setDisplayTestData} />
      ) : (
        <></>
      )}
    </Card>
  );
};
