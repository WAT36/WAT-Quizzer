import React from 'react';
import styles from './TextField.module.css';
import { TextField as MuiTextField } from '@mui/material';

interface TextFieldProps {
  label: string;
  className?: string[];
  setStater?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
}

export const TextField = ({ label, className, setStater }: TextFieldProps) => (
  <MuiTextField
    className={[styles.textField].concat(className ? className.map((x) => styles[x] || '') : []).join(' ')}
    label={label}
    onChange={(e) => {
      if (setStater) {
        setStater(e.target.value);
      }
    }}
  />
);
