import React from "react";
import Container from '@mui/material/Container';

import EnglishBotLayout from "./components/EnglishBotLayout";


class EnglishBotDictionaryPage extends React.Component {

    contents = () => {
        return (
            <Container>
                <h1>Dictionary</h1>
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

export default EnglishBotDictionaryPage;