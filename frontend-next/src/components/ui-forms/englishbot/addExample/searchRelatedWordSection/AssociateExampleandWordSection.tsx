import React, { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { CardContent } from '@mui/material';
import type { GridRowSelectionModel, GridRowsProp } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { meanColumns } from '../../../../../constants/contents/table/englishbot';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import type { AssociateExampleandWordData } from 'quizzer-lib';
import { searchExampleAPI, submitAssociationExampleAPI } from '@/utils/api-wrapper';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';

interface AssociateExampleandWordSectionProps {}

export const AssociateExampleandWordSection = ({}: AssociateExampleandWordSectionProps) => {
  const [associateExampleandWord, setAssociateExampleandWord] = useState<AssociateExampleandWordData>({});
  const [searchExampleWord, setSearchExampleWord] = useState<string>('');
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [canAssociation, setCanAssociation] = useState<boolean>(false);
  const [canRelease, setCanRelease] = useState<boolean>(false);
  const setMessage = useSetRecoilState(messageState);

  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    setAssociateExampleandWord({
      ...associateExampleandWord,
      checkedIdList: selectionModel as number[]
    });
  };

  return (
    <Card variant="outlined" attr={['margin-vertical']} header="単語例文紐付け">
      <CardContent className="flex">
        <TextField
          label="例文に紐付ける単語名(完全一致)"
          variant="outlined"
          className={['flex-auto']}
          setStater={(value: string) => {
            setAssociateExampleandWord({
              ...associateExampleandWord,
              wordName: value
            });
          }}
        />
        <Button
          label={'例文検索(解除用)'}
          variant="contained"
          color="primary"
          attr={'after-inline'}
          onClick={async (e) => {
            if (!associateExampleandWord.wordName || associateExampleandWord.wordName === '') {
              setMessage &&
                setMessage({
                  message: 'エラー:単語が入力されていません',
                  messageColor: 'error',
                  isDisplay: true
                });
              return;
            }
            setMessage &&
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
            setSearchResult([]);
            setCanRelease(true);
            setCanAssociation(false);
            const result = await searchExampleAPI({
              searchExampleData: {
                query: associateExampleandWord.wordName || '',
                isLinked: true
              }
            });
            setMessage && setMessage(result.message);
            if (result.result && Array.isArray(result.result)) {
              setSearchResult(result.result);
            }
          }}
        />
      </CardContent>

      <CardContent className="flex">
        <TextField
          label="例文検索(単語入力)"
          variant="outlined"
          className={['flex-auto']}
          setStater={(value: string) => {
            setSearchExampleWord(value);
          }}
        />
        <Button
          label={'例文検索(紐付用)'}
          variant="contained"
          color="primary"
          attr={'after-inline'}
          onClick={async (e) => {
            if (!searchExampleWord || searchExampleWord === '') {
              setMessage &&
                setMessage({
                  message: 'エラー:単語が入力されていません',
                  messageColor: 'error',
                  isDisplay: true
                });
              return;
            }
            setMessage &&
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
            setSearchResult([]);
            setCanRelease(false);
            setCanAssociation(true);
            const result = await searchExampleAPI({
              searchExampleData: {
                query: searchExampleWord || '',
                isLinked: false
              }
            });
            setMessage && setMessage(result.message);
            if (result.result && Array.isArray(result.result)) {
              setSearchResult(result.result);
            }
          }}
        />
      </CardContent>

      <CardContent className="flex">
        <div className="w-full overflow-x-auto">
          <DataGrid
            rows={searchResult}
            columns={meanColumns}
            pageSizeOptions={[15]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
            className="min-w-[640px] border-0"
            autoHeight
            density="compact"
          />
        </div>
      </CardContent>

      <CardContent>
        <Button
          label={'例文紐付'}
          variant="contained"
          color="primary"
          attr={'after-inline'}
          disabled={!canAssociation}
          onClick={async (e) => {
            setMessage &&
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
            const result = await submitAssociationExampleAPI({
              submitAssociationExampleData: {
                wordName: associateExampleandWord.wordName || '',
                checkedIdList: associateExampleandWord.checkedIdList || [],
                isAssociation: true
              }
            });
            setSearchResult([]);
            setCanRelease(false);
            setCanAssociation(false);
            setMessage && setMessage(result.message);
          }}
        />
        <Button
          label={'例文解除'}
          variant="contained"
          color="primary"
          attr={'after-inline'}
          disabled={!canRelease}
          onClick={async (e) => {
            setMessage &&
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
            const result = await submitAssociationExampleAPI({
              submitAssociationExampleData: {
                wordName: associateExampleandWord.wordName || '',
                checkedIdList: associateExampleandWord.checkedIdList || [],
                isAssociation: false
              }
            });
            setSearchResult([]);
            setCanRelease(false);
            setCanAssociation(false);
            setMessage && setMessage(result.message);
          }}
        />
      </CardContent>
    </Card>
  );
};
