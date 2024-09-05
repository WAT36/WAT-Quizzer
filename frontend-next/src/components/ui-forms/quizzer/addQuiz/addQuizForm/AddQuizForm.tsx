import React from 'react';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { QueryOfPutQuizState } from '../../../../../../interfaces/state';
import { PutQuizForm } from '../../forms/putQuizForm/PutQuizForm';
import { PullDownOptionDto } from 'quizzer-lib';

interface AddQuizFormProps {
  filelistoption: PullDownOptionDto[];
  value: number;
  queryOfPutQuizState: QueryOfPutQuizState;
  setValue?: React.Dispatch<React.SetStateAction<number>>;
  setQueryofPutQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const AddQuizForm = ({
  filelistoption,
  value,
  queryOfPutQuizState,
  setValue,
  setQueryofPutQuizStater
}: AddQuizFormProps) => {
  // ファイル選択の切り替え
  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    if (setQueryofPutQuizStater) {
      setQueryofPutQuizStater((prev) => ({
        ...prev,
        fileNum: +e.target.value
      }));
    }
  };

  return (
    <>
      <FormGroup>
        <FormControl>
          <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
        </FormControl>

        <PutQuizForm
          value={value}
          queryOfPutQuizState={queryOfPutQuizState}
          setValue={setValue}
          setQueryofPutQuizStater={setQueryofPutQuizStater}
        />
      </FormGroup>
    </>
  );
};
