import React, { ReactNode } from 'react';
import { Card as MuiCard, CardHeader as MuiCardHeader } from '@mui/material';
import styles from './Card.module.css';

interface CardProps {
  variant: string;
  attr?: string;
  header?: string;
  subHeader?: string;
  children?: ReactNode;
}

export const Card = ({ variant = 'outlined', ...props }: CardProps) => {
  return (
    <>
      <MuiCard className={(props.attr ? props.attr.split(' ').map((x) => styles[x] || '') : []).join(' ')}>
        {props.header && <MuiCardHeader title={props.header} />}
        {props.subHeader && <MuiCardHeader subheader={props.subHeader} />}
        {props.children}
      </MuiCard>
    </>
  );
};
