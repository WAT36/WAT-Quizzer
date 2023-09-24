import React from 'react';
import './button.css';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
  label: string;
  mode?: 'regular' | 'square';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'contained' | 'outlined' | 'text';
  href?: string;
  onClick?: () => void;
}

export const Button = ({ color = 'primary', variant = 'outlined', label, ...props }: ButtonProps) => {
  return (
    <>
      <MuiButton
        className={['button', props.mode ? (props.mode === 'regular' ? '' : props.mode) : ''].join(' ')}
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
