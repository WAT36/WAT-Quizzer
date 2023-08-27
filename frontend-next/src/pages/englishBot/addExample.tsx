import React, { useState } from 'react';

import EnglishBotLayout from './components/EnglishBotLayout';
import { messageBoxStyle, searchedTableStyle } from '../../styles/Pages';
import { Button, Card, CardContent, CardHeader, Container, TextField, Typography } from '@mui/material';
import { get } from '@/common/API';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { meanColumns } from '../../../utils/englishBot/SearchWordTable';

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
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [message, setMessage] = useState({
    message: '　',
    messageColor: 'common.black'
  });

  const searchWord = () => {
    if (!query || query === '') {
      setMessage({ message: 'エラー:検索語句を入力して下さい', messageColor: 'error' });
      return;
    }

    setMessage({ message: '通信中...', messageColor: '#d3d3d3' });
    get(
      '/english/word/byname',
      (data: any) => {
        if (data.status === 200) {
          const result = data.body?.wordData || [];
          setSearchResult(result);
          setMessage({
            message: 'Success!!取得しました',
            messageColor: 'success.light'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      },
      {
        name: query
      }
    );
  };

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
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
                <Button variant="contained" style={buttonAfterInputTextStyle} onClick={(e) => searchWord()}>
                  検索
                </Button>
              </CardContent>

              <CardContent style={cardContentStyle}>
                <div style={searchedTableStyle}>
                  <DataGrid
                    rows={searchResult}
                    columns={meanColumns}
                    pageSizeOptions={[15]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    //onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel, details)}
                  />
                </div>
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
