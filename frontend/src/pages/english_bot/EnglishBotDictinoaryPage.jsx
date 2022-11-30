import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import API from "../../common/API";

import EnglishBotLayout from "./components/EnglishBotLayout";


export default function EnglishBotDictionaryPage() {

    const [tableData, setTableData] = useState([])
    const [message, setMessage] = useState({
        message: '',
        messageColor: 'initial',
    })

    useEffect(() => {
        comingDisplay();
    }, [])

    const comingDisplay = () => {
        API.post("/english/word/search", {
            "wordName": ""
        }, (data) => {
            if (data.status === 200) {
                setTableData(data)
            } else {
                setMessage({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        })
    }

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
