import React from 'react';

import styles from './Header.module.css';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HeaderBar } from '../../ui-elements/headerBar/HeaderBar';

interface HeaderProps {
  bgColor: string;
  onClick: (event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) => void;
}

export const Header = ({ bgColor = '#0077B6', onClick }: HeaderProps) => (
  <HeaderBar bgColor={bgColor}>
    <span className={styles.title}>WAT Quizzer</span>
    <span className={styles.right}>
      <IconButton onClick={onClick} size="small">
        <MenuIcon style={{ color: 'white' }} />
      </IconButton>
    </span>
  </HeaderBar>
);
