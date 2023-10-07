import React from 'react';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import styles from './PullDown.module.css';

interface PullDownProps {
  label: string;
  optionList: {
    value: number | string;
    label: string;
  }[];
  onChange?: (e: SelectChangeEvent<number>) => void;
}

export const PullDown = ({ label, optionList, onChange }: PullDownProps) => {
  return (
    <>
      <InputLabel id="quiz-file-input" className={styles.pulldown}>
        {label}
      </InputLabel>
      <Select
        className={styles.pulldown}
        labelId="quiz-file-name"
        id="quiz-file-id"
        defaultValue={-1}
        onChange={onChange}
      >
        <MenuItem value={-1} key={-1}>
          選択なし
        </MenuItem>
        {optionList.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
