import React from 'react';
import {
  DisplayQuizState,
  MessageState,
  PullDownOptionState,
  QueryOfQuizState
} from '../../../../../../interfaces/state';
import { FormControl, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import { GetQuizButton } from '@/components/ui-parts/button-patterns/getQuiz/GetQuiz.button';

interface InputQueryForEditFormProps {
  filelistoption: PullDownOptionState[];
  queryOfQuizState: QueryOfQuizState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryofQuizStater?: React.Dispatch<React.SetStateAction<QueryOfQuizState>>;
  setDisplayQuizStater?: React.Dispatch<React.SetStateAction<DisplayQuizState>>;
}

export const InputQueryForEditForm = ({
  filelistoption,
  queryOfQuizState,
  setMessageStater,
  setQueryofQuizStater,
  setDisplayQuizStater,
}: InputQueryForEditFormProps) => {
  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    if (!setMessageStater || !setQueryofQuizStater || !setDisplayQuizStater) {
      return;
    }

    setQueryofQuizStater({
      ...queryOfQuizState,
      fileNum: e.target.value as number
    });
    setMessageStater({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
  };

  return (
    <>
    <FormGroup>
    <FormControl>
      <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
    </FormControl>

    <FormControl>
      <TextField
        label="問題番号"
        setStater={(value: string) => {
          if(setQueryofQuizStater){
            setQueryofQuizStater({
              ...queryOfQuizState,
              quizNum: +value
            });
          }
        }}
      />
    </FormControl>

    <FormControl>
      <RadioGroupSection
          sectionTitle={'問題種別'}
          radioGroupProps={{
            radioButtonProps: [
              {
                value: 'basic',
                label: '基礎問題'
              },
              {
                value: 'applied',
                label: '応用問題'
              },
              {
                value: '4choice',
                label: '四択問題'
              }
            ],
            defaultValue: 'basic',
            setQueryofQuizStater: (value: string) => {
              if (setQueryofQuizStater) {
                setQueryofQuizStater({
                  ...queryOfQuizState,
                  format: value
                });
              }
            }
          }}
        />
    </FormControl>
  </FormGroup>

  <GetQuizButton
        queryOfQuizState={queryOfQuizState}
        setDisplayQuizStater={setDisplayQuizStater}
        setMessageStater={setMessageStater}
        setQueryofQuizStater={setQueryofQuizStater}
      />
  </>
  );
};
