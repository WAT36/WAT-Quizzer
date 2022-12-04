import React from "react";
import { useRecoilState } from 'recoil';
import Drawer from "@material-ui/core/Drawer";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Link } from "react-router-dom";

import { sideBarContents, toggleDrawer } from '../utils/SideBar.ts'
import { isOpenState } from '../atoms/SideBar.ts'
import { drawerStyle } from '../styles/SideBar.ts'

export default function EnglishBotSideBar() {
    const [sidebarState, setSidebarState] = useRecoilState(isOpenState);

    return (
        <Drawer
            style={drawerStyle}
            anchor='right'
            open={sidebarState.open}
            onClose={toggleDrawer(false, setSidebarState)}
        >
            <List>
                {sideBarContents.map((value) => (
                    <ListItem key={value.name} disablePadding>
                        <Link to={value.link} onClick={toggleDrawer(false, setSidebarState)}>{value.name}</Link>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}