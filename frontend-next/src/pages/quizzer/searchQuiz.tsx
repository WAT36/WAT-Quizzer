import React, { useEffect, useState } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import { columns } from '../../../utils/quizzer/SearchTable';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { QueryOfSearchQuizState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { SearchQueryForm } from '@/components/ui-forms/quizzer/searchQuiz/searchQueryForm/SearchQueryForm';
import { Button } from '@/components/ui-elements/button/Button';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { EditSearchResultForm } from '@/components/ui-forms/quizzer/searchQuiz/editSearchResultForm/EditSearchResultForm';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { searchQuizAPI } from '@/api/quiz/searchQuizAPI';
import {
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter,
  getQuizFileListAPI,
  GetQuizFileApiResponseDto
} from 'quizzer-lib';

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
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([] as number[]);
  const [changedCategory, setChangedCategory] = useState<string>('');

  useEffect(() => {
    if (!isMock) {
      (async () => {
        setMessage({
          message: '通信中...',
          messageColor: '#d3d3d3',
          isDisplay: true
        });
        const result = await getQuizFileListAPI();
        setMessage(result.message);
        const pullDownOption = result.result
          ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
          : [];
        setFilelistoption(pullDownOption);
      })();
    }
  }, [isMock, setMessage]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <SearchQueryForm
          filelistoption={filelistoption}
          categorylistoption={categorylistoption}
          queryOfSearchQuizState={queryOfSearchQuizState}
          setMessage={setMessage}
          setCategorylistoption={setCategorylistoption}
          setQueryofSearchQuizState={setQueryOfSearchQuizState}
        />

        <Button
          label={'検索'}
          attr={'button-array'}
          variant="contained"
          color="primary"
          onClick={(e) => searchQuizAPI({ queryOfSearchQuizState, setMessage, setSearchResult })}
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
