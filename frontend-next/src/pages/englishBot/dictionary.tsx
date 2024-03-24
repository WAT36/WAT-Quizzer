import React, { useState } from 'react';
import { Container } from '@mui/material';
import { searchedDetailColumns } from '../../../utils/englishBot/SearchWordTable';
import { GridRowsProp } from '@mui/x-data-grid';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { SearchInputSection } from '@/components/ui-forms/englishbot/dictionary/searchInputSection/SearchInputSection';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotDictionaryPage({ isMock }: Props) {
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [message, setMessage] = useRecoilState(messageState);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer - Dictionary"></Title>
        <SearchInputSection setMessage={setMessage} setSearchResult={setSearchResult} />
        <SearchResultTable searchResult={searchResult} columns={searchedDetailColumns} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'辞書'} />
    </>
  );
}
