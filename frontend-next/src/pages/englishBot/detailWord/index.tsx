import React, { useState } from 'react';

import { get } from '../../../common/API';
import EnglishBotLayout from '../components/EnglishBotLayout';
import { buttonStyle, messageBoxStyle, searchedTableStyle } from '../../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';

export const searchedDetailColumns = [
  {
    field: 'id',
    headerName: 'ID',
    sortable: true,
    width: 100
  },
  {
    field: 'name',
    headerName: '単語',
    sortable: true,
    width: 300,
    renderCell: (params: any) => (
      <Link tabIndex={params.id} href={'/englishBot/detailWord/' + params.id}>
        {params.value}
      </Link>
    )
  }
];

export default function EnglishBotDetailWordPage() {
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
      '/english/word/search',
      (data: any) => {
        if (data.status === 200) {
          const result = data.body?.wordData || [];
          setSearchResult(result);
          setMessage({
            message: 'Success!!' + result.length + '問の問題を取得しました',
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
        wordName: query
      }
    );
  };

  const contents = () => {
    return (
      <Container>
        <h1>Detail Word</h1>
        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <FormGroup>
          <FormControl>
            <TextField
              label="単語入力"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </FormControl>
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => searchWord()}>
          検索
        </Button>

        <div style={searchedTableStyle}>
          <DataGrid
            rows={searchResult}
            columns={searchedDetailColumns}
            pageSizeOptions={[15]}
            //checkboxSelection
            disableRowSelectionOnClick
            //onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel, details)}
          />
        </div>
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} title={'単語詳細Top'} />
    </>
  );
}
