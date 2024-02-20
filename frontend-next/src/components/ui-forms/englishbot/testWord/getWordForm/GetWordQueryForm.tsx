import React from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { PullDownOptionState, QueryOfGetWordState } from '../../../../../../interfaces/state';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './GetWordQueryForm.module.css';

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
      <FormControl className={styles.row}>
        登録日時指定：
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date" className={styles.datePicker} />
        </LocalizationProvider>
        〜
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="End Date" className={styles.datePicker} />
        </LocalizationProvider>
      </FormControl>
    </FormGroup>
  );
};
