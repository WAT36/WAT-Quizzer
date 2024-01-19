import React, { useEffect, useState } from 'react';

import { DataGrid, GridRowsProp, GridRowSelectionModel } from '@mui/x-data-grid';

import { get, post, put } from '../../common/API';
import { buttonStyle, groupStyle, searchedTableStyle } from '../../styles/Pages';
import { columns } from '../../../utils/quizzer/SearchTable';
import { Button as MuiButton, Container, FormControl, FormGroup, TextField } from '@mui/material';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizViewApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState, QueryOfSearchQuizState } from '../../../interfaces/state';
import { getFileList } from '@/common/response';
import { Title } from '@/components/ui-elements/title/Title';
import { SearchQueryForm } from '@/components/ui-forms/quizzer/searchQuiz/searchQueryForm/SearchQueryForm';
import { searchQuizAPI } from '@/common/ButtonAPI';
import { Button } from '@/components/ui-elements/button/Button';

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

  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    setCheckedIdList(selectionModel as number[]);
  };

  // チェックした問題に指定カテゴリを一括登録する
  const registerCategoryToChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:チェックされた問題がありません',
        messageColor: 'error'
      });
      return;
    } else if (changedCategory === '') {
      setMessage({
        message: 'エラー:一括登録するカテゴリ名を入力して下さい',
        messageColor: 'error'
      });
      return;
    }

    // チェックした問題にカテゴリを登録
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const addCategoriesToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = [];
      for (const checkedId of idList) {
        await post(
          '/quiz/category',
          {
            file_num: queryOfSearchQuizState.fileNum,
            quiz_num: checkedId,
            category: changedCategory
          },
          (data: ProcessingApiReponse) => {
            if (data.status !== 200 && data.status !== 201) {
              failureIdList.push(checkedId);
            }
          }
        );
      }
      return { failureIdList };
    };
    const { failureIdList } = await addCategoriesToQuiz(checkedIdList);

    let message: string;
    let messageColor: 'error' | 'success.light';
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのカテゴリ登録に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件登録成功）`;
      messageColor = 'error';
    } else {
      message = `チェック問題(${checkedIdList.length}件)へのカテゴリ登録に成功しました`;
      messageColor = 'success.light';
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
    setMessage({
      message,
      messageColor
    });
  };

  // チェックした問題から指定カテゴリを一括削除する
  const removeCategoryFromChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:チェックされた問題がありません',
        messageColor: 'error'
      });
      return;
    } else if (changedCategory === '') {
      setMessage({
        message: 'エラー:一括削除するカテゴリ名を入力して下さい',
        messageColor: 'error'
      });
      return;
    }

    // チェックした問題からカテゴリを削除
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const removeCategories = async (idList: number[]) => {
      const failureIdList: number[] = [];
      for (const checkedId of idList) {
        await put(
          '/quiz/category',
          {
            file_num: queryOfSearchQuizState.fileNum,
            quiz_num: checkedId,
            category: changedCategory
          },
          (data: ProcessingApiReponse) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId);
            }
          }
        );
      }
      return { failureIdList };
    };
    const { failureIdList } = await removeCategories(checkedIdList);

    let message: string;
    let messageColor: 'error' | 'success.light';
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]のカテゴリ削除に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件削除成功）`;
      messageColor = 'error';
    } else {
      message = `チェック問題(${checkedIdList.length}件)のカテゴリ削除に成功しました`;
      messageColor = 'success.light';
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
    setMessage({
      message,
      messageColor
    });
  };

  // 選択した問題全てにチェックをつける
  const checkedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:選択された問題がありません',
        messageColor: 'error'
      });
      return;
    }

    // 選択した問題にチェック
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const checkToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = [];
      for (const checkedId of idList) {
        await put(
          '/quiz/check',
          {
            file_num: queryOfSearchQuizState.fileNum,
            quiz_num: checkedId
          },
          (data: ProcessingApiReponse) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId);
            }
          }
        );
      }
      return { failureIdList };
    };
    const { failureIdList } = await checkToQuiz(checkedIdList);

    let message: string;
    let messageColor: 'error' | 'success.light';
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのチェック登録に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件登録成功）`;
      messageColor = 'error';
    } else {
      message = `選択した問題(${checkedIdList.length}件)へのチェック登録に成功しました`;
      messageColor = 'success.light';
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
    setMessage({
      message,
      messageColor
    });
  };

  // 選択した問題全てにチェックを外す
  const uncheckedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:選択された問題がありません',
        messageColor: 'error'
      });
      return;
    }

    // 選択した問題にチェック
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const uncheckToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = [];
      for (const checkedId of idList) {
        await put(
          '/quiz/uncheck',
          {
            file_num: queryOfSearchQuizState.fileNum,
            quiz_num: checkedId
          },
          (data: ProcessingApiReponse) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId);
            }
          }
        );
      }
      return { failureIdList };
    };
    const { failureIdList } = await uncheckToQuiz(checkedIdList);

    let message: string;
    let messageColor: 'error' | 'success.light';
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのチェック削除に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件削除成功）`;
      messageColor = 'error';
    } else {
      message = `選択した問題(${checkedIdList.length}件)へのチェック削除に成功しました`;
      messageColor = 'success.light';
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
    setMessage({
      message,
      messageColor
    });
  };

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

        <div style={searchedTableStyle}>
          <DataGrid
            rows={searchResult}
            columns={columns}
            pageSizeOptions={[15]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
          />
        </div>

        <FormGroup style={groupStyle} row>
          チェックした問題全てにカテゴリ「
          <FormControl>
            <TextField
              id="change-category"
              value={changedCategory}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                setChangedCategory(e.target.value)
              }
            />
          </FormControl>
          」を
          <FormControl>
            <MuiButton
              style={buttonStyle}
              variant="contained"
              color="primary"
              disabled={queryOfSearchQuizState.format !== 'basic'}
              onClick={async (e) => await registerCategoryToChecked()}
            >
              一括カテゴリ登録
            </MuiButton>
          </FormControl>
          or
          <FormControl>
            <MuiButton
              style={buttonStyle}
              variant="contained"
              color="primary"
              disabled={queryOfSearchQuizState.format !== 'basic'}
              onClick={async (e) => await removeCategoryFromChecked()}
            >
              一括カテゴリ削除
            </MuiButton>
          </FormControl>
        </FormGroup>

        <FormGroup style={groupStyle} row>
          チェックした問題全てに
          <FormControl>
            <MuiButton
              style={buttonStyle}
              variant="contained"
              color="primary"
              disabled={queryOfSearchQuizState.format !== 'basic'} // TODO 応用問題検索結果からチェック機能つける
              onClick={async (e) => await checkedToSelectedQuiz()}
            >
              ✅をつける
            </MuiButton>
          </FormControl>
          or
          <FormControl>
            <MuiButton
              style={buttonStyle}
              variant="contained"
              color="primary"
              disabled={queryOfSearchQuizState.format !== 'basic'}
              onClick={async (e) => await uncheckedToSelectedQuiz()}
            >
              ✅を外す
            </MuiButton>
          </FormControl>
        </FormGroup>
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
