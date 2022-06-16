import React from "react"
import { Button, Container } from '@material-ui/core';

const buttonStyle = {
    'margin'     :  '20px',
}

class TopPage extends React.Component {
    render(){
        return (
            <Container>
                <h1>WAT Quizzer</h1>

                <Button style={buttonStyle} variant="contained" size="large" color="primary" href="/selectquiz">
                    Quizzer
                </Button>
                <br />
                <Button style={buttonStyle} variant="contained" size="large" disabled>
                    English Quiz Bot
                </Button>

            </Container>
        )
    }
}

export default TopPage