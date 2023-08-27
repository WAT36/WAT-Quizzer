import React, { useState } from 'react';

import EnglishBotLayout from './components/EnglishBotLayout';
import { messageBoxStyle } from '../../styles/Pages';
import { Card, CardContent, Container, Typography } from '@mui/material';

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
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} title={'例文追加'} />
    </>
  );
}
