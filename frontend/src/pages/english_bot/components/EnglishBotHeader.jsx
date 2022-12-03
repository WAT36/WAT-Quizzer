import React from "react";
import { useSetRecoilState } from 'recoil';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';

import { isOpenState } from '../atoms/SideBar'
import { toggleDrawer } from '../utils/SideBar'

const headerStyle = {
    'position': 'fixed',
    'top': 0,
    'width': '100%',
    'height': '30px',
    'backgroundColor': 'midnightblue',
    'zIndex': '10000',
}

const titleStyle = {
    'color': 'white',
    'fontWeight': 'bolder',
    'lineHeight': '30px',
}

const rightStyle = {
    'position': 'absolute',/*←絶対位置*/
    'right': '10px',
    'lineHeight': '30px',
}
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