import React, { ReactNode } from 'react';
import styles from './Button.module.css';
import { Card as MuiCard } from '@mui/material';

interface CardProps {
  children?: ReactNode;
}

export const Card = ({ ...props }: CardProps) => {
  return (
    <>
      <MuiCard>{props.children}</MuiCard>
    </>
  );
};
