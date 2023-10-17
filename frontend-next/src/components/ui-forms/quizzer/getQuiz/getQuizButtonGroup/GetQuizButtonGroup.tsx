import React from 'react';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../../interfaces/state';
import { GetRandomQuizButton } from '@/components/ui-parts/button-patterns/getRandomQuiz/GetRandomQuiz.button';
import { GetWorstRateQuizButton } from '@/components/ui-parts/button-patterns/getWorstRateQuiz/GetWorstRateQuiz.button';
import { GetMinimumClearQuizButton } from '@/components/ui-parts/button-patterns/getMinimumClearQuiz/GetMinimumClearQuiz.button';
import { GetImageOfQuizButton } from '@/components/ui-parts/button-patterns/getImageOfQuiz/GetImageOfQuiz.button';
import { GetQuizButton } from '@/components/ui-parts/button-patterns/getQuiz/GetQuiz.button';

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
        setQueryofQuizStater={setQueryofQuizStater}
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
      <GetImageOfQuizButton
        queryOfQuizState={queryOfQuizState}
        setDisplayQuizStater={setDisplayQuizStater}
        setMessageStater={setMessageStater}
        setQueryofQuizStater={setQueryofQuizStater}
      />
    </>
  );
};
