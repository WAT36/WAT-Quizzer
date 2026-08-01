import React from 'react';
import { Button as MuiButton, SxProps, Theme } from '@mui/material';

interface ButtonProps {
  label: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'contained' | 'outlined' | 'text';
  href?: string;
  attr?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  onClick?: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

// CSSクラス名をTailwindクラスにマッピング
const getTailwindClasses = (attr?: string): string => {
  if (!attr) return '';

  const classMappings: { [key: string]: string } = {
    separate: '!my-[20px] !mx-[10px]',
    'button-array': '!m-[10px]',
    'top-button': '!m-[20px] w-[100px] h-[100px]',
    'no-margin': '!m-[0px]',
    'no-border': 'border-none',
    'after-inline': 'flex-none !m-[10px]',
    'no-min-width': 'min-w-none',
    'margin-x-10': '!mx-[10px]'
  };

  return attr
    .split(' ')
    .map((className) => classMappings[className] || '')
    .filter(Boolean)
    .join(' ');
};

export const Button = ({
  color = 'primary',
  size = 'medium',
  variant = 'text',
  label,
  attr,
  ...props
}: ButtonProps) => {
  const tailwindClasses = getTailwindClasses(attr);

  return (
    <>
      <MuiButton className={tailwindClasses} variant={variant} size={size} color={color} {...props}>
        {label}
      </MuiButton>
    </>
  );
};
