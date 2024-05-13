import React from 'react';
import { DisplayWordTestState, MessageState, QueryOfGetWordState } from '../../../../../../interfaces/state';
import { Button } from '@/components/ui-elements/button/Button';
import { getTestDataOfFourChoiceAPI } from '@/api/englishbot/getTestDataOfFourChoiceAPI';
import { getLRUTestDataOfFourChoiceAPI } from '@/api/englishbot/getLRUTestDataOfFourChoiceAPI';

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
      {/* TODO 今思ったが下のAPI2つ共通化すべきでは？LRUには特定のパラメータ入れて分岐処理させる。管理が大変  */}
      <Button
        label={'Random Word'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) => getTestDataOfFourChoiceAPI({ queryOfGetWordState, setMessageStater, setDisplayWordTest })}
      />
      <Button
        label={'LRU'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) => getLRUTestDataOfFourChoiceAPI({ queryOfGetWordState, setMessageStater, setDisplayWordTest })}
      />
    </>
  );
};
