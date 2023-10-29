import React from 'react';
import { MessageState, QueryOfGetWordState } from '../../../../../../interfaces/state';
import { GetRandomWordButton } from '@/components/ui-parts/button-patterns/getRandomWord/GetRandomWord.button';

interface GetWordButtonGroupProps {
  queryOfGetWordState: QueryOfGetWordState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
}

export const GetWordButtonGroup = ({ queryOfGetWordState, setMessageStater }: GetWordButtonGroupProps) => {
  return (
    <>
      <GetRandomWordButton queryOfGetWordState={queryOfGetWordState} setMessageStater={setMessageStater} />
    </>
  );
};
