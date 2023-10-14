import React from 'react';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../interfaces/state';
import { Button, CardActions, CardContent, Collapse, Typography } from '@mui/material';
import { ClearQuizButton } from '@/components/ui-parts/button-patterns/clearQuiz/ClearQuiz.button';
import { FailQuizButton } from '@/components/ui-parts/button-patterns/failQuiz/FailQuiz.button';
import { ReverseCheckQuizButton } from '@/components/ui-parts/button-patterns/reverseCheckQuiz/reverseCheckQuiz.button';
import { Card } from '@/components/ui-elements/card/Card';

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
          <Button size="small" onClick={handleExpandClick} aria-expanded={displayQuizState.expanded}>
            答え
          </Button>
        </CardActions>
        <Collapse in={displayQuizState.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1" component="h2">
              {displayQuizState.quizAnswer}
            </Typography>
            <ClearQuizButton
              queryOfQuizState={queryOfQuizState}
              displayQuizState={displayQuizState}
              setMessageStater={setMessageStater}
              setDisplayQuizStater={setDisplayQuizStater}
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
