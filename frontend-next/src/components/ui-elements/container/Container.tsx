import type { ReactNode } from 'react';
import React from 'react';
import { Container as MuiContainer } from '@mui/material';

interface ContainerProps {
  attr?: string[];
  children?: ReactNode;
}

export const Container = ({ attr = [], children }: ContainerProps) => {
  // CSSモジュールのクラス名をTailwind CSSクラスにマッピング
  const getTailwindClasses = (cssClasses: string[]) => {
    return cssClasses
      .map((className) => {
        switch (className) {
          case 'flex-center':
            return '!flex justify-center items-center min-h-screen m-[0px]';
          default:
            return '';
        }
      })
      .join(' ');
  };

  return <MuiContainer className={getTailwindClasses(attr)}>{children}</MuiContainer>;
};
