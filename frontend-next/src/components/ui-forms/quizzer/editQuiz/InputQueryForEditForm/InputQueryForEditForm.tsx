import React from 'react';
import {
  DisplayQuizState,
  MessageState,
  PullDownOptionState,
  QueryOfPutQuizState,
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
  setQueryOfEditQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

const radioButtonLabelArray = [
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
];
const getLabelIndex = (value: string) => {
  for (let i = 0; i < radioButtonLabelArray.length; i++) {
    if (value === radioButtonLabelArray[i]['value']) {
      return i;
    }
  }
  return -1;
};

export const InputQueryForEditForm = ({
  filelistoption,
  queryOfQuizState,
  setMessageStater,
  setQueryofQuizStater,
  setQueryOfEditQuizStater
}: InputQueryForEditFormProps) => {
  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    if (!setMessageStater || !setQueryofQuizStater || !setQueryOfEditQuizStater) {
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
              if (setQueryofQuizStater) {
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
              radioButtonProps: radioButtonLabelArray,
              defaultValue: radioButtonLabelArray[0]['value'],
              setQueryofQuizStater: (value: string) => {
                if (setQueryofQuizStater) {
                  setQueryofQuizStater({
                    ...queryOfQuizState,
                    format: value
                  });
                }
                if (setQueryOfEditQuizStater) {
                  setQueryOfEditQuizStater((prev) => ({
                    ...prev,
                    format: value,
                    formatValue: getLabelIndex(value)
                  }));
                }
              }
            }}
          />
        </FormControl>
      </FormGroup>

      <GetQuizButton
        queryOfQuizState={queryOfQuizState}
        setMessageStater={setMessageStater}
        setQueryofPutQuizStater={setQueryOfEditQuizStater}
      />
    </>
  );
};
