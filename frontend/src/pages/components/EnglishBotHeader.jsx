import React from "react";

const headerStyle = {
    'position': 'fixed',
    'top': 0,
    'width': '100%',
    'height': '30px',
    'backgroundColor': 'midnightblue',
    'z-index': '10000',
}

const titleStyle = {
    'color': 'white',
    'fontWeight': 'bolder',
    'lineHeight': '30px',
}

export default class EnglishBotHeader extends React.Component{
    render(){
        return (
            <header style={headerStyle}>
                <span style={titleStyle}>
                    WAT Quizzer (EnglishBot)
                </span>
            </header>
        )
    }
}