import React from 'react';

import './header.css';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  bgColor: string;
  onClick: () => void;
}

export const Header = ({ bgColor = '#0077B6', onClick }: HeaderProps) => (
  <header style={{ backgroundColor: bgColor }}>
    <span className="title">WAT Quizzer</span>
    <span className="right">
      <IconButton onClick={onClick} size="small">
        <MenuIcon style={{ color: 'white' }} />
      </IconButton>
    </span>
  </header>
);
