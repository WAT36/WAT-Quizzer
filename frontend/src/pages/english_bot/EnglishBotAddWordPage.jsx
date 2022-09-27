import React from "react";
import { Button, Card, CardContent, Container, FormControl, InputLabel, MenuItem, Select, FormGroup, Typography, TextField } from "@material-ui/core"
import EnglishBotLayout from "./components/EnglishBotLayout";


class EnglishBotAddWordPage extends React.Component {

    contents = () => {
        return (
            <Container>
                <h1>Add Word</h1>

            </Container>
        )
    }

    render() {
        return (
            <>
                <EnglishBotLayout
                    contents={this.contents()}
                />
            </>
        )
    }

}

export default EnglishBotAddWordPage;