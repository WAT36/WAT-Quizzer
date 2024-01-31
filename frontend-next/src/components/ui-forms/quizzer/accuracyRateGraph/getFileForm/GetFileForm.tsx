import React from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { PullDownOptionState, QueryOfGetAccuracyState } from '../../../../../../interfaces/state';

interface GetFileFormProps {
  filelistoption: PullDownOptionState[];
  queryOfGetAccuracy: QueryOfGetAccuracyState;
  setQueryOfGetAccuracy?: React.Dispatch<React.SetStateAction<QueryOfGetAccuracyState>>;
}

export const GetFileForm = ({ filelistoption, queryOfGetAccuracy, setQueryOfGetAccuracy }: GetFileFormProps) => {
  return (
    <>
      <FormGroup>
        <FormControl>
          <PullDown
            label={'問題ファイル'}
            optionList={filelistoption}
            onChange={(e) => {
              setQueryOfGetAccuracy &&
                setQueryOfGetAccuracy({
                  ...queryOfGetAccuracy,
                  fileNum: +e.target.value
                });
            }}
          />
        </FormControl>
      </FormGroup>
    </>
  );
};
