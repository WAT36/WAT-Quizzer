import React from 'react';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../../interfaces/state';
import { GetRandomQuizButton } from '@/components/ui-parts/button-patterns/getRandomQuiz/GetRandomQuiz.button';
import { GetWorstRateQuizButton } from '@/components/ui-parts/button-patterns/getWorstRateQuiz/GetWorstRateQuiz.button';
import { GetMinimumClearQuizButton } from '@/components/ui-parts/button-patterns/getMinimumClearQuiz/GetMinimumClearQuiz.button';
import { GetQuizButton } from '@/components/ui-parts/button-patterns/getQuiz/GetQuiz.button';
import { getImageOfQuizAPI } from '@/common/ButtonAPI';
import { Button } from '@/components/ui-elements/button/Button';

interface GetQuizButtonGroupProps {
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
}

export const GetQuizButtonGroup = ({
  queryOfQuizState,
  setMessageStater,
  setDisplayQuizStater,
  setQueryofQuizStater
}: GetQuizButtonGroupProps) => {
  return (
    <>
      <GetQuizButton
        queryOfQuizState={queryOfQuizState}
        setDisplayQuizStater={setDisplayQuizStater}
        setMessageStater={setMessageStater}
      />
      <GetRandomQuizButton
        queryOfQuizState={queryOfQuizState}
        setDisplayQuizStater={setDisplayQuizStater}
        setMessageStater={setMessageStater}
        setQueryofQuizStater={setQueryofQuizStater}
      />
      <GetWorstRateQuizButton
        queryOfQuizState={queryOfQuizState}
        setDisplayQuizStater={setDisplayQuizStater}
        setMessageStater={setMessageStater}
        setQueryofQuizStater={setQueryofQuizStater}
      />
      <GetMinimumClearQuizButton
        queryOfQuizState={queryOfQuizState}
        setDisplayQuizStater={setDisplayQuizStater}
        setMessageStater={setMessageStater}
        setQueryofQuizStater={setQueryofQuizStater}
      />
      <Button
        label={'画像表示'}
        attr={'button-array'}
        variant="contained"
        color="info"
        disabled={true}
        onClick={(e) =>
          getImageOfQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
        }
      />
    </>
  );
};
