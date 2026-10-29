import React, { useState } from 'react';
import { Button as MuiButton, CardActions, CardContent, Collapse } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import type { GetEnglishWordTestDataAPIResponseDto } from 'quizzer-lib';
import { submitEnglishBotTestAPI, toggleWordCheckAPI } from '@/utils/api-wrapper';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface SelfGradeAnswerProps {
  displayTestData: GetEnglishWordTestDataAPIResponseDto;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetEnglishWordTestDataAPIResponseDto>>;
  // 結果登録時に送るテスト形式(WORD_TEST_TYPE)
  testType: number;
  // 「答え」を押すと表示する内容
  children: React.ReactNode;
}

// 答えを表示して自己採点(正解・不正解)を登録する部分。単語名テスト・意味当てテストで共通
export const SelfGradeAnswer = ({ displayTestData, setDisplayTestData, testType, children }: SelfGradeAnswerProps) => {
  const setMessage = useSetRecoilState(messageState);
  const [expanded, setExpanded] = useState<boolean>(false);
  const noWord = !displayTestData.word?.name;

  const submitResult = async (selectedValue: boolean) => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    const result = await submitEnglishBotTestAPI({
      testResult: {
        wordId: displayTestData.word?.id || NaN,
        testType
      },
      selectedValue
    });
    setMessage(result.message);
    if (result.isSuccess) {
      setDisplayTestData && setDisplayTestData({});
    }
    setExpanded(false);
  };

  return (
    <>
      <CardActions>
        <MuiButton size="small" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} disabled={noWord}>
          答え
        </MuiButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {children}
          <Button
            label={'正解!!'}
            attr={'button-array'}
            variant="contained"
            color="primary"
            disabled={noWord}
            onClick={() => submitResult(true)}
          />
          <Button
            label={'不正解...'}
            attr={'button-array'}
            variant="contained"
            color="secondary"
            disabled={noWord}
            onClick={() => submitResult(false)}
          />
          <Button
            label={'チェック反転'}
            attr={'button-array'}
            variant="contained"
            color="warning"
            disabled={noWord}
            onClick={async () => {
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
              const result = await toggleWordCheckAPI({
                toggleCheckData: {
                  wordId: displayTestData.word?.id || NaN
                }
              });
              setMessage(result.message);
              setDisplayTestData &&
                setDisplayTestData({
                  ...displayTestData,
                  word: displayTestData.word
                    ? {
                        ...displayTestData.word,
                        checked: !displayTestData.word?.checked
                      }
                    : undefined
                });
            }}
          />
        </CardContent>
      </Collapse>
    </>
  );
};
