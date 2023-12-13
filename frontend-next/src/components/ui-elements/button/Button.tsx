import React from 'react';
import styles from './Button.module.css';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
  label: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'contained' | 'outlined' | 'text';
  href?: string;
  attr?: string;
  disabled?: boolean;
  onClick?: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

export const Button = ({ color = 'primary', size = 'medium', variant = 'outlined', label, ...props }: ButtonProps) => {
  return (
    <>
      <MuiButton
        className={(props.attr ? props.attr.split(' ').map((x) => styles[x] || '') : []).join(' ')}
        variant={variant}
        size={size}
        color={color}
        {...props}
      >
        {label}
      </MuiButton>
    </>
  );
};
