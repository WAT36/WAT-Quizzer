import React, { useState } from 'react';
import styles from './EditSearchResultForm.module.css';
import { FormControl, FormGroup, TextField } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import {
  SearchQuizAPIRequestDto,
  addCategoryToQuizAPI,
  checkOffQuizAPI,
  checkOnQuizAPI,
  deleteCategoryOfQuizAPI
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface EditSearchResultFormProps {
  checkedIdList: number[];
  searchQuizRequestData: SearchQuizAPIRequestDto;
  setCheckedIdList?: React.Dispatch<React.SetStateAction<number[]>>;
}

export const EditSearchResultForm = ({
  checkedIdList,
  searchQuizRequestData,
  setCheckedIdList
}: EditSearchResultFormProps) => {
  const [changedCategory, setChangedCategory] = useState<string>('');
  const setMessage = useSetRecoilState(messageState);

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

    // カテゴリをチェックした問題に一括登録
    const result = await addCategoryToQuizAPI({
      addCategoryToQuizRequestData: {
        file_num: searchQuizRequestData.file_num,
        quiz_num: checkedIdList
          .map((id) => {
            return String(id);
          })
          .join(','),
        category: changedCategory
      }
    });
    setMessage({
      ...result.message
    });
    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
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

    const result = await deleteCategoryOfQuizAPI({
      deleteCategoryToQuizRequestData: {
        file_num: searchQuizRequestData.file_num,
        quiz_num: checkedIdList
          .map((id) => {
            return String(id);
          })
          .join(','),
        category: changedCategory
      }
    });
    setMessage({
      ...result.message
    });
    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
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
    const result = await checkOnQuizAPI({
      checkQuizRequestData: {
        file_num: searchQuizRequestData.file_num,
        quiz_num: checkedIdList
          .map((id) => {
            return String(id);
          })
          .join(',')
      }
    });
    setMessage({
      ...result.message
    });
    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
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
    const result = await checkOffQuizAPI({
      checkQuizRequestData: {
        file_num: searchQuizRequestData.file_num,
        quiz_num: checkedIdList
          .map((id) => {
            return String(id);
          })
          .join(',')
      }
    });
    setMessage({
      ...result.message
    });
    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList && setCheckedIdList([]);
    setChangedCategory && setChangedCategory('');
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
            disabled={searchQuizRequestData.format !== 'basic'}
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
            disabled={searchQuizRequestData.format !== 'basic'}
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
            disabled={searchQuizRequestData.format !== 'basic'} // TODO 応用問題検索結果からチェック機能つける
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
            disabled={searchQuizRequestData.format !== 'basic'}
            onClick={async (e) => await uncheckedToSelectedQuiz()}
          ></Button>
        </FormControl>
      </FormGroup>
    </>
  );
};
