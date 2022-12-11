import { Container } from "@mui/material";
import React from "react";
import EnglishBotLayout from "../components/EnglishBotLayout";

export default function EnglishBotWordDetailPage() {

    const contents = () => {
        return (
            <Container>
                <h1>Word Detail</h1>
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
