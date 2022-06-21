import React from "react";

const headerStyle = {
    'height': '30px',
    'background-color': '#0077B6',
}

const titleStyle = {
    'color': 'white',
    'font-weight': 'bolder',
    'line-height': '30px',
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