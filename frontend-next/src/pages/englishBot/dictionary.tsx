import React, { useState } from 'react';
import { Container } from '@mui/material';
import { searchedDetailColumns } from '../../constants/contents/table/englishbot';
import type { GridRowsProp } from '@mui/x-data-grid';
import { Layout } from '@/components/templates/layout/Layout';
import { SearchInputSection } from '@/components/ui-forms/englishbot/dictionary/searchInputSection/SearchInputSection';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';

type Props = {};

export default function EnglishBotDictionaryPage({}: Props) {
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const setMessage = useSetRecoilState(messageState);

  const contents = () => {
    return (
      <Container className="!py-4">
        <SearchInputSection setMessage={setMessage} setSearchResult={setSearchResult} />
        <SearchResultTable searchResult={searchResult} columns={searchedDetailColumns} />
      </Container>
    );
  };

  return <Layout mode="englishBot" contents={contents()} title={'Dictionary'} />;
}
