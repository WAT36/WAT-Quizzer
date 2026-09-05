import React, { useState } from 'react';
import { FormControl, FormGroup, TextField } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { addCategoryToQuizAPI, checkOffQuizAPI, checkOnQuizAPI, deleteCategoryOfQuizAPI } from '@/utils/api-wrapper';
import { expandCategoriesWithAncestors } from '@/utils/categoryUtils';

interface EditSearchResultFormProps {
  checkedIdList: number[];
  setCheckedIdList: React.Dispatch<React.SetStateAction<number[]>>;
}

const BATCH_SIZE = 10;

const chunkArray = (arr: number[], size: number): number[][] => {
  const chunks: number[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const EditSearchResultForm = ({ checkedIdList, setCheckedIdList }: EditSearchResultFormProps) => {
  const [changedCategory, setChangedCategory] = useState<string>('');
  const setMessage = useSetRecoilState(messageState);

  // チェックした問題に指定カテゴリを一括登録する（親カテゴリも自動登録）
  const registerCategoryToChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:チェックされた問題がありません',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    } else if (changedCategory === '') {
      setMessage({
        message: 'エラー:一括登録するカテゴリ名を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    // sessionStorageからfile_numを取得して親カテゴリも含めて展開
    let categoriesToRegister = [changedCategory];
    try {
      const saved = sessionStorage.getItem('searchQuizRequestData');
      if (saved) {
        const parsed = JSON.parse(saved);
        const fileNum = parsed.file_num ?? -1;
        if (fileNum !== -1) {
          categoriesToRegister = await expandCategoriesWithAncestors([changedCategory], fileNum);
        }
      }
    } catch (e) {
      // 取得失敗時は指定カテゴリのみ登録
    }

    const chunks = chunkArray(checkedIdList, BATCH_SIZE);
    for (const category of categoriesToRegister) {
      for (let i = 0; i < chunks.length; i++) {
        setMessage({ message: `通信中... (${i + 1}/${chunks.length})`, messageColor: '#d3d3d3', isDisplay: true });
        const result = await addCategoryToQuizAPI({
          addCategoryToQuizRequestData: {
            quiz_id: chunks[i].map(String).join(','),
            category
          }
        });
        if (result.message.messageColor === 'error') {
          setMessage({ ...result.message });
          return;
        }
      }
    }
    setMessage({ message: `${checkedIdList.length}問にカテゴリを登録しました`, messageColor: 'success', isDisplay: true });
    setCheckedIdList([]);
    setChangedCategory('');
  };

  // チェックした問題から指定カテゴリを一括削除する
  const removeCategoryFromChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:チェックされた問題がありません',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    } else if (changedCategory === '') {
      setMessage({
        message: 'エラー:一括削除するカテゴリ名を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    const chunks = chunkArray(checkedIdList, BATCH_SIZE);
    for (let i = 0; i < chunks.length; i++) {
      setMessage({ message: `通信中... (${i + 1}/${chunks.length})`, messageColor: '#d3d3d3', isDisplay: true });
      const result = await deleteCategoryOfQuizAPI({
        deleteCategoryToQuizRequestData: {
          quiz_id: chunks[i].map(String).join(','),
          category: changedCategory
        }
      });
      if (result.message.messageColor === 'error') {
        setMessage({ ...result.message });
        return;
      }
    }
    setMessage({ message: `${checkedIdList.length}問からカテゴリを削除しました`, messageColor: 'success', isDisplay: true });
    setCheckedIdList([]);
    setChangedCategory('');
  };

  // 選択した問題全てにチェックをつける
  const checkedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:選択された問題がありません',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    const chunks = chunkArray(checkedIdList, BATCH_SIZE);
    for (let i = 0; i < chunks.length; i++) {
      setMessage({ message: `通信中... (${i + 1}/${chunks.length})`, messageColor: '#d3d3d3', isDisplay: true });
      const result = await checkOnQuizAPI({
        checkQuizRequestData: { quiz_id: chunks[i].map(String).join(',') }
      });
      if (result.message.messageColor === 'error') {
        setMessage({ ...result.message });
        return;
      }
    }
    setMessage({ message: `${checkedIdList.length}問に✅をつけました`, messageColor: 'success', isDisplay: true });
    setCheckedIdList([]);
    setChangedCategory('');
  };

  // 選択した問題全てにチェックを外す
  const uncheckedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:選択された問題がありません',
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    const chunks = chunkArray(checkedIdList, BATCH_SIZE);
    for (let i = 0; i < chunks.length; i++) {
      setMessage({ message: `通信中... (${i + 1}/${chunks.length})`, messageColor: '#d3d3d3', isDisplay: true });
      const result = await checkOffQuizAPI({
        checkQuizRequestData: { quiz_id: chunks[i].map(String).join(',') }
      });
      if (result.message.messageColor === 'error') {
        setMessage({ ...result.message });
        return;
      }
    }
    setMessage({ message: `${checkedIdList.length}問の✅を外しました`, messageColor: 'success', isDisplay: true });
    setCheckedIdList([]);
    setChangedCategory('');
  };

  return (
    <>
      <FormGroup className="border border-gray-300 dark:border-gray-600 rounded-md !my-[4px] !p-[5px] flex items-center" row>
        チェックした問題全てにカテゴリ「
        <FormControl>
          <TextField
            id="change-category"
            inputProps={{ 'aria-label': '変更後のカテゴリ' }}
            value={changedCategory}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
              setChangedCategory && setChangedCategory(e.target.value)
            }
          />
        </FormControl>
        」を
        <FormControl>
          <Button
            attr="!mx-[10px]"
            label={'一括カテゴリ登録'}
            variant="contained"
            color="primary"
            disabled={checkedIdList.length === 0}
            onClick={async (e) => await registerCategoryToChecked()}
          ></Button>
        </FormControl>
        or
        <FormControl>
          <Button
            attr="!mx-[10px]"
            label={'一括カテゴリ削除'}
            variant="contained"
            color="primary"
            disabled={checkedIdList.length === 0}
            onClick={async (e) => await removeCategoryFromChecked()}
          ></Button>
        </FormControl>
      </FormGroup>

      <FormGroup className="border border-gray-300 dark:border-gray-600 rounded-md !my-[10px] !p-[5px] flex items-center" row>
        チェックした問題全てに
        <FormControl>
          <Button
            attr="!mx-[10px]"
            label={'✅をつける'}
            variant="contained"
            color="primary"
            disabled={checkedIdList.length === 0} // TODO 応用問題検索結果からチェック機能つける
            onClick={async (e) => await checkedToSelectedQuiz()}
          ></Button>
        </FormControl>
        or
        <FormControl>
          <Button
            attr="!mx-[10px]"
            label={'✅を外す'}
            variant="contained"
            color="primary"
            disabled={checkedIdList.length === 0}
            onClick={async (e) => await uncheckedToSelectedQuiz()}
          ></Button>
        </FormControl>
      </FormGroup>
    </>
  );
};
