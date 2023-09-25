import React, { ReactNode } from 'react';
import styles from './HeaderBar.module.css';

interface HeaderBarProps {
  bgColor: string;
  children?: ReactNode;
}

export const HeaderBar = ({ bgColor = '#0077B6', ...props }: HeaderBarProps) => (
  <header className={styles.headerBar} style={{ backgroundColor: bgColor }}>
    {props.children}
  </header>
);
