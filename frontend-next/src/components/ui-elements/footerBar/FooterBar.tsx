import React, { ReactNode } from 'react';
import styles from './FooterBar.module.css';

interface FooterBarProps {
  bgColor: string;
  children?: ReactNode;
}

export const FooterBar = ({ bgColor = '#0077B6', ...props }: FooterBarProps) => (
  <footer className={styles.footerBar} style={{ backgroundColor: bgColor }}>
    {props.children}
  </footer>
);
