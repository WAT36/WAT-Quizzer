import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import API from "../../common/API";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">未定</TableCell>
                            <TableCell align="right">未定</TableCell>
                            <TableCell align="right">未定</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((data) => (
                            < TableRow
                                key={data.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {data.id}
                                </TableCell>
                                <TableCell align="right">{data.name}</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
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
