import React, { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { Button as MuiButton, CardActions, CardContent, Collapse } from '@mui/material';
import { GetExampleTestDataAPIResponseDto } from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { submitExampleTestDataAPI } from '@/utils/api-wrapper';

interface DisplayTestExampleSectionProps {
  displayTestData: GetExampleTestDataAPIResponseDto;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetExampleTestDataAPIResponseDto>>;
}

export const DisplayTestExampleSection = ({ displayTestData, setDisplayTestData }: DisplayTestExampleSectionProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const setMessage = useSetRecoilState(messageState);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          {displayTestData.example?.ja_example_sentense && (
            <p>{displayTestData.example.ja_example_sentense}</p>
          )}
        </CardContent>
        <CardActions>
          <MuiButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            disabled={!displayTestData.example?.id}
          >
            答え
          </MuiButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {displayTestData.example?.en_example_sentense && (
              <p>{displayTestData.example.en_example_sentense}</p>
            )}
            <Button
              label={'正解!!'}
              attr={'button-array'}
              variant="contained"
              color="primary"
              disabled={!displayTestData.example?.id}
              onClick={async () => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await submitExampleTestDataAPI({
                  testResult: { exampleId: displayTestData.example!.id, testType: 0 },
                  selectedValue: true
                });
                setMessage(result.message);
                if (result.message.messageColor === 'success.light') {
                  setDisplayTestData && setDisplayTestData({});
                  setExpanded(false);
                }
              }}
            />
            <Button
              label={'不正解...'}
              attr={'button-array'}
              variant="contained"
              color="secondary"
              disabled={!displayTestData.example?.id}
              onClick={async () => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await submitExampleTestDataAPI({
                  testResult: { exampleId: displayTestData.example!.id, testType: 0 },
                  selectedValue: false
                });
                setMessage(result.message);
                if (result.message.messageColor === 'success.light') {
                  setDisplayTestData && setDisplayTestData({});
                  setExpanded(false);
                }
              }}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
