import React, { ReactNode } from 'react';
import styles from './TextField.module.css';
import { TextField as MuiTextField } from '@mui/material';

interface TextFieldProps {
  label: string;
  setStater?: React.Dispatch<React.SetStateAction<string>>;
}

export const TextField = ({ label, setStater }: TextFieldProps) => (
  <MuiTextField
    className={styles.textField}
    label={label}
    onChange={(e) => {
      if (setStater) {
        setStater(e.target.value);
      }
    }}
  />
);
