import React, { useState } from 'react';

import EnglishBotLayout from './components/EnglishBotLayout';
import { buttonStyle, messageBoxStyle, searchedTableStyle } from '../../styles/Pages';
import { Button, Card, CardContent, CardHeader, Container, TextField, Typography } from '@mui/material';
import { get } from '@/common/API';
import { DataGrid, GridRowSelectionModel, GridRowsProp } from '@mui/x-data-grid';
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

type InputExampleData = {
  exampleJa?: string;
  exampleEn?: string;
  wordId?: number;
  wordMeanId?: number[];
};

export default function EnglishBotAddExamplePage() {
  const [inputExampleData, setInputExampleData] = useState<InputExampleData>({});
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

          if (result.length > 0) {
            const copyInputData = Object.assign({}, inputExampleData);
            copyInputData.wordId = Number(result[0].word_id);
            setInputExampleData(copyInputData);
          }

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

  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel, details?: any) => {
    const copyInputData = Object.assign({}, inputExampleData);
    copyInputData.wordMeanId = selectionModel as number[];
    setInputExampleData(copyInputData);
  };

  // 例文データ登録
  const submitExampleData = () => {
    console.log(`now state: ${JSON.stringify(inputExampleData)}`);
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
                  onChange={(e) => {
                    const copyInputData = Object.assign({}, inputExampleData);
                    copyInputData.exampleEn = e.target.value;
                    setInputExampleData(copyInputData);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
              </CardContent>
              <CardHeader subheader="例文(和訳)" />
              <CardContent style={cardContentStyle}>
                <TextField
                  label="例文(和訳)"
                  variant="outlined"
                  onChange={(e) => {
                    const copyInputData = Object.assign({}, inputExampleData);
                    copyInputData.exampleJa = e.target.value;
                    setInputExampleData(copyInputData);
                  }}
                  style={inputTextBeforeButtonStyle}
                />
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
                    onRowSelectionModelChange={(selectionModel, details) =>
                      registerCheckedIdList(selectionModel, details)
                    }
                  />
                </div>
              </CardContent>

              <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => submitExampleData()}>
                登録
              </Button>
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
