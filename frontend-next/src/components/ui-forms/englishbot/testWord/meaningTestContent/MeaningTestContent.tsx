import React from 'react';
import { CardContent, Typography } from '@mui/material';
import type { GetEnglishWordTestDataAPIResponseDto } from 'quizzer-lib';
import { WORD_TEST_TYPE } from 'quizzer-lib';
import { SelfGradeAnswer } from '../selfGradeAnswer/SelfGradeAnswer';

interface MeaningTestContentProps {
  displayTestData: GetEnglishWordTestDataAPIResponseDto;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetEnglishWordTestDataAPIResponseDto>>;
}

// 意味当てテスト：意味を表示し、答えで英単語を表示する
export const MeaningTestContent = ({ displayTestData, setDisplayTestData }: MeaningTestContentProps) => {
  return (
    <CardContent>
      <Typography variant="subtitle1" component="h2">
        {displayTestData.word?.mean &&
          displayTestData.word?.mean.map((mean, index) => {
            return (
              <li key={index}>
                {`[${mean.partsofspeech.name}]`}
                {mean.meaning}
              </li>
            );
          })}
      </Typography>
      <SelfGradeAnswer
        displayTestData={displayTestData}
        setDisplayTestData={setDisplayTestData}
        testType={WORD_TEST_TYPE.MEANING}
      >
        <div>
          <h2>{displayTestData.word?.name || ''}</h2>
        </div>
      </SelfGradeAnswer>
    </CardContent>
  );
};
