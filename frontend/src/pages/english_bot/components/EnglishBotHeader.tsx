import React from "react";
import { useSetRecoilState } from 'recoil';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';

import { isOpenState } from '../atoms/SideBar.ts'
import { toggleDrawer } from '../utils/SideBar.ts'
import { headerStyle, titleStyle, rightStyle } from '../styles/Header.ts'

export default function EnglishBotHeader() {
    const setSidebarState = useSetRecoilState(isOpenState);

    return (
        <header style={headerStyle}>
            <span style={titleStyle}>
                WAT Quizzer (EnglishBot)
            </span>
            <span className="right" style={rightStyle}>
                <IconButton onClick={toggleDrawer(true, setSidebarState)} size='small' >
                    <MenuIcon style={{ color: "white" }} />
                </IconButton>
            </span>
        </header>
    )
}