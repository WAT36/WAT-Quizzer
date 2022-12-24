import React from "react";

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

export default class QuizzerHeader extends React.Component{
    render(){
        return (
            <header style={headerStyle}>
                <span style={titleStyle}>
                    WAT Quizzer
                </span>
            </header>
        )
    }
}