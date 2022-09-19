import React from "react";
import { IconButton } from '@material-ui/core';
import Drawer from "@material-ui/core/Drawer";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@mui/icons-material/Menu';

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

const drawerStyle = {
    'zIndex': '10001',
}

export default class EnglishBotHeader extends React.Component {
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
            <>
                <header style={headerStyle}>
                    <span style={titleStyle}>
                        WAT Quizzer (EnglishBot)
                    </span>
                    <span className="right" style={rightStyle}>
                        <IconButton onClick={this.toggleDrawer(true)} size='small' >
                            <MenuIcon style={{ color: "white" }} />
                        </IconButton>
                    </span>
                </header>
                <Drawer
                    style={drawerStyle}
                    anchor='right'
                    open={this.state.open}
                    onClose={this.toggleDrawer(false)}
                >
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                {text}
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </>
        )
    }
}