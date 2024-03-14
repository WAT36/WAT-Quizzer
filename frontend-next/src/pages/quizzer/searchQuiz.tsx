import React, { useEffect, useState } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import { columns } from '../../../utils/quizzer/SearchTable';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, QueryOfSearchQuizState } from '../../../interfaces/state';
import { getFileList } from '@/common/response';
import { Title } from '@/components/ui-elements/title/Title';
import { SearchQueryForm } from '@/components/ui-forms/quizzer/searchQuiz/searchQueryForm/SearchQueryForm';
import { searchQuizAPI } from '@/common/ButtonAPI';
import { Button } from '@/components/ui-elements/button/Button';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { EditSearchResultForm } from '@/components/ui-forms/quizzer/searchQuiz/editSearchResultForm/EditSearchResultForm';

type Props = {
  isMock?: boolean;
};

export default function SearchQuizPage({ isMock }: Props) {
  const [queryOfSearchQuizState, setQueryOfSearchQuizState] = useState<QueryOfSearchQuizState>({
    fileNum: -1,
    query: '',
    format: 'basic'
  });
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionState[]>([]);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([] as number[]);
  const [changedCategory, setChangedCategory] = useState<string>('');

  useEffect(() => {
    !isMock && getFileList(setMessage, setFilelistoption);
  }, []);

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
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'問題検索'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
