import React, { useEffect, useState } from 'react';

import { DataGrid, GridRowsProp, GridRowSelectionModel } from '@mui/x-data-grid';

import { post, put } from '../../common/API';
import { buttonStyle, groupStyle, searchedTableStyle } from '../../styles/Pages';
import { columns } from '../../../utils/quizzer/SearchTable';
import { Button as MuiButton, Container, FormControl, FormGroup, TextField } from '@mui/material';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, QueryOfSearchQuizState } from '../../../interfaces/state';
import { getFileList } from '@/common/response';
import { Title } from '@/components/ui-elements/title/Title';
import { SearchQueryForm } from '@/components/ui-forms/quizzer/searchQuiz/searchQueryForm/SearchQueryForm';
import { searchQuizAPI } from '@/common/ButtonAPI';
import { Button } from '@/components/ui-elements/button/Button';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { EditSearchResultForm } from '@/components/ui-forms/quizzer/searchQuiz/editSearchResultForm/EditSearchResultForm';

export default function SearchQuizPage() {
  const [queryOfSearchQuizState, setQueryOfSearchQuizState] = useState<QueryOfSearchQuizState>({
    fileNum: -1,
    query: '',
    format: ''
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
    getFileList(setMessage, setFilelistoption);
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

        <SearchResultTable searchResult={searchResult} columns={columns} setCheckedIdList={setCheckedIdList} />

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
