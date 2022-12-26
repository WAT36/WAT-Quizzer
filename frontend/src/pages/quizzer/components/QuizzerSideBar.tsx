import React from "react";
import { useRecoilState } from 'recoil';
import Drawer from "@material-ui/core/Drawer";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Link } from "react-router-dom";

import { sideBarContents, toggleDrawer } from '../utils/SideBar'
import { isOpenState } from '../../../atoms/SideBar'
import { drawerStyle } from '../../../styles/SideBar'

export default function QuizzerSideBar() {
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
                    <ListItem key={value.name}>
                        <Link to={value.link} onClick={toggleDrawer(false, setSidebarState)}>{value.name}</Link>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}