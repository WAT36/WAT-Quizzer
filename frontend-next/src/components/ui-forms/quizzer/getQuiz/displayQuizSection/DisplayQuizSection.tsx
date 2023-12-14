import React from 'react';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../../interfaces/state';
import { Button as MuiButton, CardActions, CardContent, Collapse, Typography } from '@mui/material';
import { FailQuizButton } from '@/components/ui-parts/button-patterns/failQuiz/FailQuiz.button';
import { ReverseCheckQuizButton } from '@/components/ui-parts/button-patterns/reverseCheckQuiz/reverseCheckQuiz.button';
import { Card } from '@/components/ui-elements/card/Card';
import { clearQuizAPI } from '@/common/ButtonAPI';
import { Button } from '@/components/ui-elements/button/Button';

interface DisplayQuizSectionProps {
  queryOfQuizState: QueryOfQuizState;
  displayQuizState: DisplayQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const DisplayQuizSection = ({
  queryOfQuizState,
  displayQuizState,
  setMessageStater,
  setDisplayQuizStater
}: DisplayQuizSectionProps) => {
  const handleExpandClick = () => {
    if (setDisplayQuizStater) {
      setDisplayQuizStater({
        ...displayQuizState,
        expanded: !displayQuizState.expanded
      });
    }
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2">
            問題
          </Typography>
          <Typography variant="subtitle1" component="h2">
            {displayQuizState.checked ? '✅' : ''}
            {displayQuizState.quizSentense.split(/(\n)/).map((item, index) => {
              return <React.Fragment key={index}>{item.match(/\n/) ? <br /> : item}</React.Fragment>;
            })}
          </Typography>
        </CardContent>

        <CardActions>
          <MuiButton size="small" onClick={handleExpandClick} aria-expanded={displayQuizState.expanded}>
            答え
          </MuiButton>
        </CardActions>
        <Collapse in={displayQuizState.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1" component="h2">
              {displayQuizState.quizAnswer}
            </Typography>
            <Typography variant="subtitle2" component="h4">
              {'解説：' + displayQuizState.explanation}
            </Typography>
            <Button
              label={'正解!!'}
              attr={'button-array'}
              variant="contained"
              color="primary"
              onClick={(e) =>
                clearQuizAPI({
                  queryOfQuizState,
                  displayQuizState,
                  setMessageStater,
                  setDisplayQuizStater
                })
              }
            />
            <FailQuizButton
              queryOfQuizState={queryOfQuizState}
              displayQuizState={displayQuizState}
              setMessageStater={setMessageStater}
              setDisplayQuizStater={setDisplayQuizStater}
            />
            <ReverseCheckQuizButton
              queryOfQuizState={queryOfQuizState}
              displayQuizState={displayQuizState}
              setMessageStater={setMessageStater}
              setDisplayQuizStater={setDisplayQuizStater}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
