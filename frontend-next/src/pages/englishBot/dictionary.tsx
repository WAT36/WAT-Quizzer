import React, { useState } from 'react';

import { get } from '../../common/API';
import { buttonStyle, searchedTableStyle } from '../../styles/Pages';
import { Button, Container, FormControl, FormGroup, TextField } from '@mui/material';
import { searchedDetailColumns } from '../../../utils/englishBot/SearchWordTable';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { WordApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';

export default function EnglishBotDictionaryPage() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [message, setMessage] = useState<MessageState>({
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
      (data: ProcessingApiReponse) => {
        if (data.status === 200 && data.body?.length > 0) {
          const result: WordApiResponse[] = data.body as WordApiResponse[];
          setSearchResult(result || []);
          setMessage({
            message: 'Success!!' + result.length + '問の問題を取得しました',
            messageColor: 'success.light'
          });
        } else if (data.status === 404 || data.body?.length === 0) {
          setSearchResult([]);
          setMessage({
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error'
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
        <Title label="WAT Quizzer - Dictionary"></Title>

        <FormGroup>
          <FormControl>
            <TextField
              label="単語名検索"
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
      <Layout
        mode="englishBot"
        contents={contents()}
        title={'辞書'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
