import React from 'react';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../../interfaces/state';
import { GetWorstRateQuizButton } from '@/components/ui-parts/button-patterns/getWorstRateQuiz/GetWorstRateQuiz.button';
import { getImageOfQuizAPI, getMinimumClearQuizAPI, getQuizAPI, getRandomQuizAPI } from '@/common/ButtonAPI';
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
      <Button
        label={'出題'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) => getQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater })}
      />
      <Button
        label={'ランダム出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={(e) =>
          getRandomQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
        }
      />
      <GetWorstRateQuizButton
        queryOfQuizState={queryOfQuizState}
        setDisplayQuizStater={setDisplayQuizStater}
        setMessageStater={setMessageStater}
        setQueryofQuizStater={setQueryofQuizStater}
      />
      <Button
        label={'最小正解数問出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={(e) =>
          getMinimumClearQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
        }
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
