import React, { useEffect, useState } from 'react';

import { get } from '../../common/API';
import EnglishBotLayout from './components/EnglishBotLayout';
import { messageBoxStyle } from '../../styles/Pages';
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
} from '@mui/material';

export default function EnglishBotDictionaryPage() {
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState({
    message: '',
    messageColor: 'common.black'
  });

  useEffect(() => {
    comingDisplay();
  }, []);

  const comingDisplay = () => {
    setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
    get(
      '/english/word/search',
      (data: any) => {
        if (data.status === 200) {
          setTableData(data.body.wordData || []);
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      },
      {
        wordName: ''
      }
    );
  };

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
              <TableRow key={data.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {data.id}
                </TableCell>
                <TableCell align="left">
                  {/* <Link to={`/english/word/${data.name}`}>{data.name}</Link> */}
                  {data.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const contents = () => {
    return (
      <Container>
        <h1>Dictionary</h1>
        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>
        {makeTableData()}
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} />
    </>
  );
}
