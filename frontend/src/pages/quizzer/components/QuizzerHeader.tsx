import { IconButton } from "@material-ui/core";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";
import { toggleDrawer } from "../utils/SideBar";
import { useSetRecoilState } from "recoil";
import { isOpenState } from "../../../atoms/SideBar";
import { rightStyle } from "../../../styles/Header";

const headerStyle = {
    'position': 'fixed' as 'fixed',
    'top': 0,
    'width': '100%',
    'height': '30px',
    'backgroundColor': '#0077B6',
    'zIndex': '10000',
}

const titleStyle = {
    'color': 'white',
    'fontWeight': 'bolder',
    'lineHeight': '30px',
}

export default function QuizzerHeader() {
    const setSidebarState = useSetRecoilState(isOpenState);

    return (
        <header style={headerStyle}>
            <span style={titleStyle}>
                WAT Quizzer
            </span>
            <span className="right" style={rightStyle}>
                <IconButton onClick={toggleDrawer(true, setSidebarState)} size='small' >
                    <MenuIcon style={{ color: "white" }} />
                </IconButton>
            </span>
        </header>
    )
}