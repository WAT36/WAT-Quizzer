import React from 'react';
import styles from './Button.module.css';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
  label: string;
  size?: 'small' | 'medium' | 'large';
  mode?: 'regular' | 'square';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'contained' | 'outlined' | 'text';
  href?: string;
  class?: string;
  onClick?: () => void;
}

export const Button = ({ color = 'primary', size = 'medium', variant = 'outlined', label, ...props }: ButtonProps) => {
  return (
    <>
      <MuiButton
        className={[styles.button, props.mode ? (props.mode === 'regular' ? '' : styles[props.mode]) : '']
          .concat(props.class ? props.class.split(' ').map((x) => styles[x] || '') : [])
          .join(' ')}
        variant={variant}
        size={'medium'}
        color={color}
        {...props}
      >
        {label}
      </MuiButton>
    </>
  );
};
