import React from 'react';
import { DisplayWordTestState, MessageState, QueryOfGetWordState } from '../../../../../../interfaces/state';
import { GetRandomWordButton } from '@/components/ui-parts/button-patterns/getRandomWord/GetRandomWord.button';

interface GetWordButtonGroupProps {
  queryOfGetWordState: QueryOfGetWordState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTest?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

export const GetWordButtonGroup = ({
  queryOfGetWordState,
  setMessageStater,
  setDisplayWordTest
}: GetWordButtonGroupProps) => {
  return (
    <>
      <GetRandomWordButton
        queryOfGetWordState={queryOfGetWordState}
        setMessageStater={setMessageStater}
        setDisplayWordTest={setDisplayWordTest}
      />
    </>
  );
};
