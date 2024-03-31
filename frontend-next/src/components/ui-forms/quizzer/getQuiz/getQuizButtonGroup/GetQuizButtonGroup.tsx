import React from 'react';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../../../../interfaces/state';
import { Button } from '@/components/ui-elements/button/Button';
import { getImageOfQuizAPI } from '@/api/quiz/getImageOfQuizAPI';
import { getMinimumClearQuizAPI } from '@/api/quiz/getMinimumClearQuizAPI';
import { getLRUQuizAPI } from '@/api/quiz/getLRUQuizAPI';
import { getReviewQuizAPI } from '@/api/quiz/getReviewQuizAPI';
import { getQuizAPI } from '@/api/quiz/getQuizAPI';
import { getRandomQuizAPI } from '@/api/quiz/getRandomQuizAPI';
import { getWorstRateQuizAPI } from '@/api/quiz/getWorstRateQuizAPI';

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
      <Button
        label={'最低正解率問出題'}
        variant="contained"
        color="secondary"
        onClick={(e) =>
          getWorstRateQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
        }
      />
      <Button
        label={'最小回答数問出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={(e) =>
          getMinimumClearQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
        }
      />
      <Button
        label={'LRU問出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={(e) =>
          getLRUQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
        }
      />
      <Button
        label={'昨日間違えた問題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={(e) =>
          getReviewQuizAPI({ queryOfQuizState, setMessageStater, setDisplayQuizStater, setQueryofQuizStater })
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
