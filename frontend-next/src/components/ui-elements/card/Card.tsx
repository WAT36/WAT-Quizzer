import React, { ReactNode } from 'react';
import { Card as MuiCard } from '@mui/material';
import styles from './Card.module.css';

interface CardProps {
  variant: string;
  attr?: string;
  children?: ReactNode;
}

export const Card = ({ variant = 'outlined', ...props }: CardProps) => {
  return (
    <>
      <MuiCard className={(props.attr ? props.attr.split(' ').map((x) => styles[x] || '') : []).join(' ')}>
        {props.children}
      </MuiCard>
    </>
  );
};
