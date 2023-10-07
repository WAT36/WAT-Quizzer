import React, { useState } from 'react';
import { InputLabel, MenuItem, Select } from '@mui/material';
import styles from './PullDown.module.css';

interface PullDownProps {
  label: string;
  fileListOption: {
    value: number;
    label: string;
  }[];
  setStater?: React.Dispatch<React.SetStateAction<number>>;
}

export const PullDown = ({ label, fileListOption, setStater }: PullDownProps) => {
  const [selectedValue, setSelectedValue] = useState<number>(-1);
  return (
    <>
      <InputLabel id="quiz-file-input" className={styles.pulldown}>
        {label}
      </InputLabel>
      <Select
        labelId="quiz-file-name"
        id="quiz-file-id"
        defaultValue={-1}
        // onChange={(e) => selectedFileChange(e)}
        onChange={(e) => {
          setSelectedValue(Number(e.target.value));
          if (setStater) {
            setStater(Number(e.target.value));
          }
        }}
      >
        <MenuItem value={-1} key={-1}>
          選択なし
        </MenuItem>
        {fileListOption.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
