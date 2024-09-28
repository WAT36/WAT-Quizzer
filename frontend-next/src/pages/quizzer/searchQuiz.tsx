import React, { useState } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import { columns } from '../../../utils/quizzer/SearchTable';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { QueryOfSearchQuizState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { SearchQueryForm } from '@/components/ui-forms/quizzer/searchQuiz/searchQueryForm/SearchQueryForm';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { EditSearchResultForm } from '@/components/ui-forms/quizzer/searchQuiz/editSearchResultForm/EditSearchResultForm';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';

type Props = {
  isMock?: boolean;
};

export default function SearchQuizPage({ isMock }: Props) {
  const [queryOfSearchQuizState, setQueryOfSearchQuizState] = useState<QueryOfSearchQuizState>({
    fileNum: -1,
    query: '',
    format: 'basic'
  });
  const [message, setMessage] = useRecoilState(messageState);
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([] as number[]);
  const [changedCategory, setChangedCategory] = useState<string>('');

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <SearchQueryForm
          queryOfSearchQuizState={queryOfSearchQuizState}
          setQueryofSearchQuizState={setQueryOfSearchQuizState}
          setSearchResult={setSearchResult}
        />

        <SearchResultTable
          searchResult={searchResult}
          columns={columns}
          hasCheck={true}
          setCheckedIdList={setCheckedIdList}
        />

        <EditSearchResultForm
          changedCategory={changedCategory}
          checkedIdList={checkedIdList}
          queryOfSearchQuizState={queryOfSearchQuizState}
          setMessage={setMessage}
          setCheckedIdList={setCheckedIdList}
          setChangedCategory={setChangedCategory}
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
