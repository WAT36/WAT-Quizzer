import React from "react";
import Drawer from "@material-ui/core/Drawer";

const footerStyle = {
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: "30px",
    backgroundColor: "midnightblue",
    color: "white",
    marginTop: "5px",
};

const leftStyle = {
    position: "absolute" /*←絶対位置*/,
    left: "0px",
    lineHeight: "30px",
};

const rightStyle = {
    position: "absolute" /*←絶対位置*/,
    right: "10px",
    lineHeight: "30px",
};

export default class EnglishBotSideBar extends React.Component {
    constructor(props) {
        console.log("props:", props)
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
                anchor='right'
                open={this.state.open}
                onClose={this.toggleDrawer(false)}
            >
                {"aaa"}
                {/* {list(anchor)} */}
            </Drawer>
        );
    }
}
