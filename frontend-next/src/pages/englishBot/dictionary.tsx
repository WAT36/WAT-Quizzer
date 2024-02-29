import React, { useState } from 'react';
import { searchedTableStyle } from '../../styles/Pages';
import { Container } from '@mui/material';
import { searchedDetailColumns } from '../../../utils/englishBot/SearchWordTable';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { SearchInputSection } from '@/components/ui-forms/englishbot/dictionary/searchInputSection/SearchInputSection';

export default function EnglishBotDictionaryPage() {
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black'
  });

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - Dictionary"></Title>

        <SearchInputSection setMessage={setMessage} setSearchResult={setSearchResult} />

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
