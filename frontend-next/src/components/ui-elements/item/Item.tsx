import type { ReactNode } from 'react';
import React from 'react';
import { Paper } from '@mui/material';

interface ItemProps {
  children?: ReactNode;
  className?: string;
}

export const Item = ({ children, className = '' }: ItemProps) => {
  return (
    <Paper className={`bg-white dark:bg-gray-800 p-4 text-center text-gray-600 dark:text-gray-400 ${className}`}>
      {children}
    </Paper>
  );
};
