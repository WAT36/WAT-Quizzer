import React from 'react';
import { MessageState, QueryOfGetAccuracyState } from '../../../../../../interfaces/state';
import { Button } from '@/components/ui-elements/button/Button';
import { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import { getAccuracy } from '@/api/category/getAccuracyAPI';

interface GetFileButtonGroupProps {
  queryOfGetAccuracy: QueryOfGetAccuracyState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setAccuracyData?: React.Dispatch<React.SetStateAction<GetAccuracyRateByCategoryAPIResponseDto>>;
}

export const GetFileButtonGroup = ({ queryOfGetAccuracy, setMessage, setAccuracyData }: GetFileButtonGroupProps) => {
  return (
    <>
      <Button
        label={'正解率表示'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) => getAccuracy({ queryOfGetAccuracy, setMessage, setAccuracyData })}
      ></Button>
    </>
  );
};
