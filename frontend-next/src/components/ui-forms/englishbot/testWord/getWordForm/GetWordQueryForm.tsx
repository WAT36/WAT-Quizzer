import React from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { PullDownOptionState, QueryOfGetWordState } from '../../../../../../interfaces/state';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './GetWordQueryForm.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { RadioGroup } from '@/components/ui-parts/radioGroup/RadioGroup';

interface GetWordQueryFormProps {
  sourcelistoption: PullDownOptionState[];
  queryOfGetWordState: QueryOfGetWordState;
  setQueryofWordStater?: React.Dispatch<React.SetStateAction<QueryOfGetWordState>>;
  setTestType?: React.Dispatch<React.SetStateAction<String>>;
}

export const GetWordQueryForm = ({
  sourcelistoption,
  queryOfGetWordState,
  setQueryofWordStater,
  setTestType
}: GetWordQueryFormProps) => {
  return (
    <Card attr={'through-card padding-vertical'}>
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
        <FormControl className={styles.row}>
          サブ出典登録日時指定：
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              className={styles.datePicker}
              onChange={(newValue) => {
                setQueryofWordStater &&
                  setQueryofWordStater({
                    ...queryOfGetWordState,
                    subSource: {
                      ...queryOfGetWordState.subSource,
                      startDate: newValue as Date
                    }
                  });
              }}
            />
          </LocalizationProvider>
          〜
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              className={styles.datePicker}
              onChange={(newValue) => {
                setQueryofWordStater &&
                  setQueryofWordStater({
                    ...queryOfGetWordState,
                    subSource: {
                      ...queryOfGetWordState.subSource,
                      endDate: newValue as Date
                    }
                  });
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl>
          テスト形式：
          <RadioGroup
            radioButtonProps={[
              {
                value: '0',
                label: '単語名'
              },
              {
                value: '1',
                label: '四択'
              }
            ]}
            defaultValue={'0'}
            setQueryofQuizStater={(value: string) => {
              setTestType && setTestType(value);
            }}
          />
        </FormControl>
      </FormGroup>
    </Card>
  );
};
