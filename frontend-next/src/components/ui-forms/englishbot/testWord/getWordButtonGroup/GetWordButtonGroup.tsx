import React from 'react';
import { DisplayWordTestState, MessageState, QueryOfGetWordState } from '../../../../../../interfaces/state';
import { getRandomWordAPI } from '@/common/ButtonAPI';
import { Button } from '@/components/ui-elements/button/Button';

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
      <Button
        label={'Random Word'}
        variant="contained"
        color="primary"
        onClick={(e) => getRandomWordAPI({ queryOfGetWordState, setMessageStater, setDisplayWordTest })}
      />
    </>
  );
};
