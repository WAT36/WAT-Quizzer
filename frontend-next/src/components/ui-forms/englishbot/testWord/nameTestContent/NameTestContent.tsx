import React from 'react';
import { CardContent, IconButton, Typography } from '@mui/material';
import { Chip } from '@/components/ui-elements/chip/Chip';
import type { GetEnglishWordTestDataAPIResponseDto } from 'quizzer-lib';
import { WORD_TEST_TYPE } from 'quizzer-lib';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { SelfGradeAnswer } from '../selfGradeAnswer/SelfGradeAnswer';

interface NameTestContentProps {
  displayTestData: GetEnglishWordTestDataAPIResponseDto;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetEnglishWordTestDataAPIResponseDto>>;
}

// 単語名テスト：英単語を表示し、答えで意味を表示する
export const NameTestContent = ({ displayTestData, setDisplayTestData }: NameTestContentProps) => {
  return (
    <CardContent>
      <div>
        <div className="text-2xl font-bold">
          {displayTestData.word?.name || ''}
          {displayTestData.word?.checked ? '✅' : ''}
          <IconButton aria-label="Dictionary" href={`/englishBot/detailWord/${displayTestData.word?.id}`}>
            <LibraryBooksOutlinedIcon />
          </IconButton>
        </div>
        {displayTestData.word?.word_source &&
          displayTestData.word?.word_source.map((value, index) => {
            return <Chip key={index} label={value.source.name} />;
          })}
        {displayTestData.word?.word_statistics_view.accuracy_rate
          ? `（正解率 ${displayTestData.word?.word_statistics_view.accuracy_rate}% / ${displayTestData.word?.word_statistics_view.answer_count}回）`
          : ''}
      </div>
      <SelfGradeAnswer
        displayTestData={displayTestData}
        setDisplayTestData={setDisplayTestData}
        testType={WORD_TEST_TYPE.NAME}
      >
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
      </SelfGradeAnswer>
    </CardContent>
  );
};
