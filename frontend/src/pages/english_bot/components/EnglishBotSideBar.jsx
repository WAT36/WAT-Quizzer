import React from "react";
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
]

export default class EnglishBotSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open || false,
        }
    }

    toggleDrawer =
        (open) =>
            (event) => {
                if (
                    event.type === 'keydown' &&
                    (event.key === 'Tab' || 'Shift')
                ) {
                    return;
                }

                this.setState({ open: open });
            };

    render() {
        return (
            <Drawer
                style={drawerStyle}
                anchor='right'
                open={this.state.open}
                onClose={this.toggleDrawer(false)}
            >
                <List>
                    {sideBarContents.map((value) => (
                        <ListItem key={value.name} disablePadding>
                            <Link to={value.link}>{value.name}</Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        )
    }
}