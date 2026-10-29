import React, { useRef } from 'react';
import { CardContent, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { Chip } from '@/components/ui-elements/chip/Chip';
import type { GetEnglishWordTestDataAPIResponseDto } from 'quizzer-lib';
import { generateFourChoiceSentense, WORD_TEST_TYPE } from 'quizzer-lib';
import { submitEnglishBotTestAPI } from '@/utils/api-wrapper';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface FourChoiceTestContentProps {
  displayTestData: GetEnglishWordTestDataAPIResponseDto;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetEnglishWordTestDataAPIResponseDto>>;
}

// 四択テスト：英単語を表示し、意味を4つの選択肢から選ぶ
export const FourChoiceTestContent = ({ displayTestData, setDisplayTestData }: FourChoiceTestContentProps) => {
  const setMessage = useSetRecoilState(messageState);
  const isFourchoiceCorrectRef = useRef<boolean | undefined>(undefined);

  return (
    <>
      <CardContent>
        <div>
          <h2>{displayTestData.word?.name || ''}</h2>
          {displayTestData.word?.word_source &&
            displayTestData.word?.word_source.map((value, index) => {
              return <Chip key={index} label={value.source.name} />;
            })}
        </div>
        {displayTestData.correct && displayTestData.dummy && (
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                isFourchoiceCorrectRef.current = (event.target as HTMLInputElement).value === 'true' ? true : false;
              }}
            >
              {generateFourChoiceSentense({ correct: displayTestData.correct, dummy: displayTestData.dummy }).map(
                (x, index) => (
                  <FormControlLabel key={index} value={x.isCorrect} control={<Radio />} label={x.sentense} />
                )
              )}
            </RadioGroup>
          </FormControl>
        )}
      </CardContent>
      <CardContent>
        <Button
          label={'SUBMIT'}
          variant="contained"
          color="primary"
          onClick={async () => {
            setMessage({
              message: '通信中...',
              messageColor: '#d3d3d3',
              isDisplay: true
            });
            const result = await submitEnglishBotTestAPI({
              testResult: {
                wordId: displayTestData.word?.id || NaN,
                testType: WORD_TEST_TYPE.FOUR_CHOICE
              },
              selectedValue: isFourchoiceCorrectRef.current
            });
            setMessage(result.message);
            if (result.isSuccess) {
              setDisplayTestData && setDisplayTestData({});
            }
            isFourchoiceCorrectRef.current = undefined;
          }}
          disabled={isNaN(displayTestData.word?.id || NaN) || !displayTestData.word?.name}
        />
      </CardContent>
    </>
  );
};
