import React from "react";
import { atom, useRecoilState } from 'recoil';
import Drawer from "@material-ui/core/Drawer";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Link } from "react-router-dom";

const drawerStyle = {
    'zIndex': '10001',
}

const sideBarContents = [
    { name: 'Top', link: '/english/top' },
    { name: 'Add Words', link: '/english/add' },
    { name: 'Dictionary', link: '/english/dictionary' },
]

export const isOpenState = atom({
    key: 'isOpen',
    default:
    {
        open: false
    },
});

export default function EnglishBotSideBar() {
    const [sidebarState, setSidebarState] = useRecoilState(isOpenState);

    const toggleDrawer =
        (isOpen) =>
            (event) => {
                if (
                    event.type === 'keydown' &&
                    (event.key === 'Tab' || 'Shift')
                ) {
                    return;
                }

                setSidebarState({ open: isOpen });
            };

    return (
        <Drawer
            style={drawerStyle}
            anchor='right'
            open={sidebarState.open}
            onClose={toggleDrawer(false)}
        >
            <List>
                {sideBarContents.map((value) => (
                    <ListItem key={value.name} disablePadding>
                        <Link to={value.link} onClick={toggleDrawer(false)}>{value.name}</Link>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}