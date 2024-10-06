import React, { useEffect, useMemo, useState } from 'react';
import { Button as MuiButton, CardActions, CardContent, Collapse, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import {
  clearQuizAPI,
  failQuizAPI,
  generateQuizSentense,
  GetQuizApiResponseDto,
  initGetQuizResponseData,
  reverseCheckQuizAPI
} from 'quizzer-lib';

interface DisplayQuizSectionProps {
  getQuizResponseData: GetQuizApiResponseDto;
  setQuizResponseData?: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
}

export const DisplayQuizSection = ({ getQuizResponseData, setQuizResponseData }: DisplayQuizSectionProps) => {
  const setMessage = useSetRecoilState(messageState);
  const [expanded, setExpanded] = useState<boolean>(false);
  const displayQuiz = useMemo(() => {
    return {
      ...getQuizResponseData,
      ...generateQuizSentense(getQuizResponseData)
    };
  }, [getQuizResponseData]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // 出題変わったら閉じる
  useEffect(() => {
    setExpanded(false);
  }, [getQuizResponseData]);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2">
            問題
          </Typography>
          <Typography variant="subtitle1" component="h2">
            {displayQuiz.checked ? '✅' : ''}
            {displayQuiz.quiz_sentense.split(/(\n)/).map((item, index) => {
              return <React.Fragment key={index}>{item.match(/\n/) ? <br /> : item}</React.Fragment>;
            })}
          </Typography>
        </CardContent>

        <CardActions>
          <MuiButton size="small" onClick={handleExpandClick} aria-expanded={expanded}>
            答え
          </MuiButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1" component="h2">
              {displayQuiz.answer}
            </Typography>
            <Typography variant="subtitle2" component="h3">
              {'解説：' + displayQuiz.advanced_quiz_explanation?.explanation}
            </Typography>
            <Button
              label={'正解!!'}
              attr={'button-array'}
              variant="contained"
              color="primary"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={async (e) => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await clearQuizAPI({
                  getQuizResponseData
                });
                setMessage(result.message);
                // TODO 成功時の判定法
                if (result.message.messageColor === 'success.light' && setQuizResponseData) {
                  setQuizResponseData(initGetQuizResponseData);
                  setExpanded(false);
                }
              }}
            />
            <Button
              label={'不正解...'}
              attr={'button-array'}
              variant="contained"
              color="secondary"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={async (e) => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await failQuizAPI({
                  getQuizResponseData
                });
                setMessage(result.message);
                // TODO 成功時の判定法
                if (result.message.messageColor === 'success.light' && setQuizResponseData) {
                  setQuizResponseData(initGetQuizResponseData);
                  setExpanded(false);
                }
              }}
            />
            <Button
              label={'チェックつける/外す'}
              attr={'button-array'}
              variant="contained"
              color="warning"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={async (e) => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await reverseCheckQuizAPI({
                  getQuizResponseData
                });
                setMessage(result.message);
                // TODO 成功時の判定法
                result.message.messageColor === 'success.light' &&
                  setQuizResponseData &&
                  setQuizResponseData((prev) => ({
                    ...prev,
                    checked: result.result ? (result.result as GetQuizApiResponseDto).checked : false
                  }));
              }}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
