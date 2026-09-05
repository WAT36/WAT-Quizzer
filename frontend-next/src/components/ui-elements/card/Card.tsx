import React, { ReactNode } from 'react';
import { Card as MuiCard, CardHeader as MuiCardHeader } from '@mui/material';

interface CardProps {
  variant?: 'outlined' | 'elevation';
  attr?: string[];
  header?: string;
  subHeader?: string;
  children?: ReactNode;
}

export const Card = ({ variant = 'outlined', attr, header, subHeader, children }: CardProps) => {
  // attrの値とtailwindクラスの対応表
  const tailwindMap: { [key: string]: string } = {
    'message-card': '!my-[10px] !mb-[20px] border-none',
    'silver-card': 'bg-gray-400 dark:bg-gray-600 !mb-[20px]',
    'through-card': '!bg-transparent',
    'square-200': 'w-[200px] h-[200px]',
    'square-300': 'w-[300px] h-[300px]',
    'square-400': 'w-[400px] h-[400px]',
    'rect-400': 'w-[400px] h-[200px]',
    'rect-straight-400': 'w-[200px] h-[400px]',
    'rect-600': 'w-[600px] h-[300px]',
    auto: 'w-auto h-auto',
    'margin-vertical': '!my-[8px]',
    padding: '!p-[8px]',
    'padding-vertical': '!py-[16px] !px-[8px]'
  };
  const classNames = attr ? attr.map((x) => tailwindMap[x] || '').join(' ') : '';

  return (
    <MuiCard variant={variant} className={`shadow-md ${classNames}`}>
      {(header || subHeader) && <MuiCardHeader title={header} subheader={subHeader} />}
      {children}
    </MuiCard>
  );
};
