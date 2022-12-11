import { Container } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import EnglishBotLayout from "../components/EnglishBotLayout";

export default function EnglishBotWordDetailPage() {

    // get word name from url
    const { name } = useParams();

    const contents = () => {
        return (
            <Container>
                <h1>{name}</h1>
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
