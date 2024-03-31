import React from 'react';
import styles from './EditSearchResultForm.module.css';
import { FormControl, FormGroup, TextField } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { MessageState, QueryOfSearchQuizState } from '../../../../../../interfaces/state';
import { post, put } from '@/api/API';
import { ProcessingApiReponse } from 'quizzer-lib';

interface EditSearchResultFormProps {
  changedCategory: string;
  checkedIdList: number[];
  queryOfSearchQuizState: QueryOfSearchQuizState;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setCheckedIdList?: React.Dispatch<React.SetStateAction<number[]>>;
  setChangedCategory?: React.Dispatch<React.SetStateAction<string>>;
}

export const EditSearchResultForm = ({
  changedCategory,
  checkedIdList,
  queryOfSearchQuizState,
  setMessage,
  setCheckedIdList,
  setChangedCategory
}: EditSearchResultFormProps) => {
  // チェックした問題に指定カテゴリを一括登録する
  const registerCategoryToChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage &&
        setMessage({
          message: 'エラー:チェックされた問題がありません',
          messageColor: 'error'
        });
      return;
    } else if (changedCategory === '') {
      setMessage &&
        setMessage({
          message: 'エラー:一括登録するカテゴリ名を入力して下さい',
          messageColor: 'error'
        });
      return;
    }

    // チェックした問題にカテゴリを登録
    setMessage &&
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
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
    setMessage &&
      setMessage({
        message,
        messageColor
      });
  };

  // チェックした問題から指定カテゴリを一括削除する
  const removeCategoryFromChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage &&
        setMessage({
          message: 'エラー:チェックされた問題がありません',
          messageColor: 'error'
        });
      return;
    } else if (changedCategory === '') {
      setMessage &&
        setMessage({
          message: 'エラー:一括削除するカテゴリ名を入力して下さい',
          messageColor: 'error'
        });
      return;
    }

    // チェックした問題からカテゴリを削除
    setMessage &&
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
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
    setMessage &&
      setMessage({
        message,
        messageColor
      });
  };

  // 選択した問題全てにチェックをつける
  const checkedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage &&
        setMessage({
          message: 'エラー:選択された問題がありません',
          messageColor: 'error'
        });
      return;
    }

    // 選択した問題にチェック
    setMessage &&
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
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
    setMessage &&
      setMessage({
        message,
        messageColor
      });
  };

  // 選択した問題全てにチェックを外す
  const uncheckedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage &&
        setMessage({
          message: 'エラー:選択された問題がありません',
          messageColor: 'error'
        });
      return;
    }

    // 選択した問題にチェック
    setMessage &&
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
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
    setMessage &&
      setMessage({
        message,
        messageColor
      });
  };

  return (
    <>
      <FormGroup className={styles.form} row>
        チェックした問題全てにカテゴリ「
        <FormControl>
          <TextField
            id="change-category"
            value={changedCategory}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
              setChangedCategory && setChangedCategory(e.target.value)
            }
          />
        </FormControl>
        」を
        <FormControl>
          <Button
            attr={styles.button}
            label={'一括カテゴリ登録'}
            variant="contained"
            color="primary"
            disabled={queryOfSearchQuizState.format !== 'basic'}
            onClick={async (e) => await registerCategoryToChecked()}
          ></Button>
        </FormControl>
        or
        <FormControl>
          <Button
            attr={styles.button}
            label={'一括カテゴリ削除'}
            variant="contained"
            color="primary"
            disabled={queryOfSearchQuizState.format !== 'basic'}
            onClick={async (e) => await removeCategoryFromChecked()}
          ></Button>
        </FormControl>
      </FormGroup>

      <FormGroup className={styles.group} row>
        チェックした問題全てに
        <FormControl>
          <Button
            attr={styles.button}
            label={'✅をつける'}
            variant="contained"
            color="primary"
            disabled={queryOfSearchQuizState.format !== 'basic'} // TODO 応用問題検索結果からチェック機能つける
            onClick={async (e) => await checkedToSelectedQuiz()}
          ></Button>
        </FormControl>
        or
        <FormControl>
          <Button
            attr={styles.button}
            label={'✅を外す'}
            variant="contained"
            color="primary"
            disabled={queryOfSearchQuizState.format !== 'basic'}
            onClick={async (e) => await uncheckedToSelectedQuiz()}
          ></Button>
        </FormControl>
      </FormGroup>
    </>
  );
};
