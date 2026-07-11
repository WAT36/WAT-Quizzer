import React, { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { Button as MuiButton, CardActions, CardContent, Collapse } from '@mui/material';
import { GetExampleTestDataAPIResponseDto } from 'quizzer-lib';

interface DisplayTestExampleSectionProps {
  displayTestData: GetExampleTestDataAPIResponseDto;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetExampleTestDataAPIResponseDto>>;
}

export const DisplayTestExampleSection = ({ displayTestData, setDisplayTestData }: DisplayTestExampleSectionProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

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
                // TODO 正解APIを呼び出す
              }}
            />
            <Button
              label={'不正解...'}
              attr={'button-array'}
              variant="contained"
              color="secondary"
              disabled={!displayTestData.example?.id}
              onClick={async () => {
                // TODO 不正解APIを呼び出す
              }}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
