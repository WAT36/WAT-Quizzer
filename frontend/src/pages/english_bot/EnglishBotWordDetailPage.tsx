import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EnglishBotLayout from './components/EnglishBotLayout'
import { messageBoxStyle } from '../../styles/Pages'
import { post } from '../../common/API'
import {
  Card,
  CardContent,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

export default function EnglishBotWordDetailPage() {
  const [tableData, setTableData] = useState([])
  const [message, setMessage] = useState({
    message: '',
    messageColor: 'initial'
  })

  // get word name from url
  const { name } = useParams()

  useEffect(() => {
    comingDisplay()
  }, [name])

  const comingDisplay = () => {
    post(
      '/english/word/mean',
      {
        wordName: name
      },
      (data: any) => {
        if (data.status === 200) {
          setTableData(data.body.wordData || [])
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          })
        }
      }
    )
  }

  const makeTableData = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">品詞</TableCell>
              <TableCell align="left">意味</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((data: any) => (
              <TableRow
                key={data.wordmean_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {data.wordmean_id}
                </TableCell>
                <TableCell align="left">{data.partsofspeech}</TableCell>
                <TableCell align="left">{data.meaning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const contents = () => {
    return (
      <Container>
        <h1>{name}</h1>
        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography
              variant="h6"
              component="h6"
              color={message.messageColor}
            >
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
      <EnglishBotLayout contents={contents()} />
    </>
  )
}
