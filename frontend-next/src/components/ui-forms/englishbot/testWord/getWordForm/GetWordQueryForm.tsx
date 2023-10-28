import React from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { PullDownOptionState, QueryOfGetWordState } from '../../../../../../interfaces/state';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';

interface GetWordQueryFormProps {
  sourcelistoption: PullDownOptionState[];
  queryOfGetWordState: QueryOfGetWordState;
  setQueryofWordStater?: React.Dispatch<React.SetStateAction<QueryOfGetWordState>>;
}

export const GetWordQueryForm = ({
  sourcelistoption,
  queryOfGetWordState,
  setQueryofWordStater
}: GetWordQueryFormProps) => {
  return (
    <FormGroup>
      <FormControl>
        <PullDown
          label={'出典'}
          optionList={sourcelistoption}
          onChange={(e) => {
            if (setQueryofWordStater) {
              setQueryofWordStater({
                ...queryOfGetWordState,
                source: String(e.target.value)
              });
            }
          }}
        />
      </FormControl>
    </FormGroup>
  );
};
