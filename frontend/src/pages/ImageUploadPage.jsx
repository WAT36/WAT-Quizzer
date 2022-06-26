import React from "react";
import { Button, Card, CardContent, Container, FormControl, InputLabel, MenuItem, Select, FormGroup, Typography } from "@material-ui/core"
import { Chart } from "react-google-charts";

import API from "../common/API";
import QuizzerLayout from "./components/QuizzerLayout";

const messageBoxStyle = {
    'margin'        : '10px 0px 20px',
    'borderStyle'  : 'none'
}

const buttonStyle = {
    'margin'     :  '10px',
}


export default class ImageUploadPage extends React.Component{
    componentDidMount(){

    }

    constructor(props){
        super(props);
        this.state = {

        }
    }


    contents = () => {
        return (
            <Container>
                <h1>WAT Quizzer</h1>

            </Container>
        )
    }

    render() {
        return (
            <>
                <QuizzerLayout 
                    contents={this.contents()}
                />
            </>
        )
    }

}
