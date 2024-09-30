import React, { useState } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import { columns } from '../../../utils/quizzer/SearchTable';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { SearchQueryForm } from '@/components/ui-forms/quizzer/searchQuiz/searchQueryForm/SearchQueryForm';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { EditSearchResultForm } from '@/components/ui-forms/quizzer/searchQuiz/editSearchResultForm/EditSearchResultForm';
import { initSearchQuizRequestData, SearchQuizAPIRequestDto } from 'quizzer-lib';

type Props = {
  isMock?: boolean;
};

export default function SearchQuizPage({ isMock }: Props) {
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([] as number[]);
  // TODO 基礎応用一本化したらこれは下部コンポーネントに入れれるはず
  const [searchQuizRequestData, setSearchQuizRequestData] =
    useState<SearchQuizAPIRequestDto>(initSearchQuizRequestData);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <SearchQueryForm
          searchQuizRequestData={searchQuizRequestData}
          setSearchResult={setSearchResult}
          setSearchQuizRequestData={setSearchQuizRequestData}
        />
        <SearchResultTable
          searchResult={searchResult}
          columns={columns}
          hasCheck={true}
          setCheckedIdList={setCheckedIdList}
        />
        <EditSearchResultForm
          checkedIdList={checkedIdList}
          searchQuizRequestData={searchQuizRequestData}
          setCheckedIdList={setCheckedIdList}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題検索'} />
    </>
  );
}
