import React, { useState } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import { columns } from '../../constants/contents/table/quizzer';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { SearchQueryForm } from '@/components/ui-forms/quizzer/searchQuiz/searchQueryForm/SearchQueryForm';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { EditSearchResultForm } from '@/components/ui-forms/quizzer/searchQuiz/editSearchResultForm/EditSearchResultForm';

export default function SearchQuizPage() {
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([] as number[]);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  const contents = () => {
    return (
      <Container className="!py-4">
        <SearchQueryForm setSearchResult={setSearchResult} setTotalCount={setTotalCount} />
        {totalCount !== undefined && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            全{totalCount}件中 {searchResult.length}件表示
          </p>
        )}
        <SearchResultTable
          searchResult={searchResult}
          columns={columns}
          hasCheck={true}
          checkedIdList={checkedIdList}
          setCheckedIdList={setCheckedIdList}
        />
        <EditSearchResultForm checkedIdList={checkedIdList} setCheckedIdList={setCheckedIdList} />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'問題検索'} />;
}
