import React from 'react';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import styles from './PullDown.module.css';

interface PullDownProps {
  optionList: {
    value: number | string;
    label: string;
  }[];
  label?: string;
  className?: string;
  onChange?: (e: SelectChangeEvent<number>) => void;
}

export const PullDown = ({ optionList, label, className, onChange }: PullDownProps) => {
  return (
    <>
      {label && (
        <InputLabel id="quiz-file-input" className={styles.pulldown}>
          {label}
        </InputLabel>
      )}
      <Select
        className={[styles.pulldown]
          .concat(
            className
              ? className.split(' ').map((x) => {
                  return styles[x];
                })
              : []
          )
          .join(' ')}
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
