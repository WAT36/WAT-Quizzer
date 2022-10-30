import React from "react";
import Container from '@mui/material/Container';

import EnglishBotLayout from "./components/EnglishBotLayout";


export default function EnglishBotDictionaryPage() {

    const contents = () => {
        return (
            <Container>
                <h1>Dictionary</h1>
            </Container>
        )
    }

    return (
        <>
            <EnglishBotLayout
                contents={contents()}
            />
        </>
    )

}
