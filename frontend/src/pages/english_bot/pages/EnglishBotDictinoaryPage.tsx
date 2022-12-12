import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { post } from "../../../common/API";
import EnglishBotLayout from "../components/EnglishBotLayout";
import { messageBoxStyle } from '../styles/Pages';
import { Link } from "react-router-dom";

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
        post("/english/word/search", {
            "wordName": ""
        }, (data: any) => {
            if (data.status === 200) {
                setTableData(data.body.wordData || [])
            } else {
                setMessage({
                    message: 'エラー:外部APIとの連携に失敗しました',
                    messageColor: 'error',
                })
            }
        })
    }

    const makeTableData = () => {
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((data: any) => (
                            < TableRow
                                key={data.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {data.id}
                                </TableCell>
                                <TableCell align="left">
                                    <Link to={`/english/word/${data.name}`}>{data.name}</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
        )
    }

    const contents = () => {
        return (
            <Container>
                <h1>Dictionary</h1>
                <Card variant="outlined" style={messageBoxStyle}>
                    <CardContent>
                        <Typography variant="h6" component="h6"
                            color={message.messageColor}>
                            {message.message}
                        </Typography>
                    </CardContent>
                </Card>
                {makeTableData()}
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
