import React, { useState } from 'react';

import EnglishBotLayout from './components/EnglishBotLayout';
import { messageBoxStyle } from '../../styles/Pages';
import { Button, Card, CardContent, CardHeader, Container, TextField, Typography } from '@mui/material';

const cardContentStyle = {
  display: 'flex',
  width: '100%'
};

const inputTextBeforeButtonStyle = {
  flex: 'auto'
};

const buttonAfterInputTextStyle = {
  flex: 'none',
  margin: '10px'
};

export default function EnglishBotAddExamplePage() {
  const [message, setMessage] = useState({
    message: '　',
    messageColor: 'common.black'
  });

  const contents = () => {
    return (
      <Container>
        <h1>Add Example Sentense</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader title="例文追加" />
          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="例文(英文)" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="例文(英語)"
                  variant="outlined"
                  // onChange={(e) => {
                  //   setFileName(e.target.value);
                  // }}
                  style={inputTextBeforeButtonStyle}
                />
                {/* <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => addFile()}>
                  追加
                </Button> */}
              </CardContent>
              <CardHeader subheader="例文(和訳)" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="例文(和訳)"
                  variant="outlined"
                  // onChange={(e) => {
                  //   setFileName(e.target.value);
                  // }}
                  style={inputTextBeforeButtonStyle}
                />
                {/* <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => addFile()}>
                  追加
                </Button> */}
              </CardContent>
            </Card>
          </CardContent>

          <CardContent>
            <Card variant="outlined">
              <CardHeader subheader="関連付け単語検索" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="単語検索(完全一致)"
                  variant="outlined"
                  // onChange={(e) => {
                  //   setFileName(e.target.value);
                  // }}
                  style={inputTextBeforeButtonStyle}
                />
                <Button
                  variant="contained"
                  style={buttonAfterInputTextStyle}
                  // onClick={(e) => addFile()}
                >
                  検索
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} title={'例文追加'} />
    </>
  );
}
