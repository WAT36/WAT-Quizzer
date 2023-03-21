import React from 'react';
import { toggleDrawer } from '../utils/SideBar';
import { useSetRecoilState } from 'recoil';
import { isOpenState } from '../../../atoms/SideBar';
import { rightStyle, titleStyle, quizzerHeaderStyle } from '../../../styles/Header';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function QuizzerHeader() {
  const setSidebarState = useSetRecoilState(isOpenState);

  return (
    <header style={quizzerHeaderStyle}>
      <span style={titleStyle}>WAT Quizzer</span>
      <span className="right" style={rightStyle}>
        <IconButton onClick={toggleDrawer(true, setSidebarState)} size="small">
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
      </span>
    </header>
  );
}
