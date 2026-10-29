import React, { useState } from 'react';
import { MenuItem, Select, TextField, Typography } from '@mui/material';
import type {
  ApiResult,
  EditWordMeanAPIRequestDto,
  GetWordDetailAPIResponseDto,
  Message,
  PullDownOptionDto
} from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { DialogModal } from '@/components/ui-parts/dialogModal/DialogModal';
import { pullDownMenuProps } from '@/constants/pullDown';
import { deleteEnglishMeanAPI, editEnglishWordMeanAPI } from '@/utils/api-wrapper';

interface EditMeanModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // 編集する意味のwordDetail.mean内のindex（-1は新規追加）
  meanIndex: number;
  posList: PullDownOptionDto[];
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

// 編集対象の意味から入力の初期値を作る。新規追加の場合は既存の最大wordmean_id+1を採番する
const createEditMeanData = (wordDetail: GetWordDetailAPIResponseDto, meanIndex: number): EditWordMeanAPIRequestDto =>
  meanIndex === -1
    ? {
        wordId: wordDetail.id,
        wordMeanId:
          wordDetail.mean.reduce(
            (previousValue, currentValue) => Math.max(previousValue, currentValue.wordmean_id),
            -1
          ) + 1,
        meanId: -1,
        partofspeechId: -1,
        meaning: ''
      }
    : {
        wordId: wordDetail.id,
        wordMeanId: wordDetail.mean[meanIndex].wordmean_id,
        meanId: wordDetail.mean[meanIndex].id,
        partofspeechId: wordDetail.mean[meanIndex].partsofspeech.id,
        meaning: wordDetail.mean[meanIndex].meaning
      };

// 単語詳細画面で意味を追加・更新・削除するモーダル
// 入力の初期値はマウント時に作るため、呼び出し側では開いている間だけ描画する
export const EditMeanModal = ({
  isOpen,
  setIsOpen,
  meanIndex,
  posList,
  wordDetail,
  setMessage,
  onUpdated
}: EditMeanModalProps) => {
  const [editMeanData, setEditMeanData] = useState<EditWordMeanAPIRequestDto>(() =>
    createEditMeanData(wordDetail, meanIndex)
  );
  const actionName = meanIndex === -1 ? '追加' : '更新';

  // 更新確認後、単語の意味を再取得させる
  const handleResult = async (result: ApiResult) => {
    setMessage && setMessage(result.message);
    if (result.isSuccess) {
      await onUpdated?.();
    }
  };

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={'意味' + actionName}
      actions={
        <>
          <Button
            label={'意味' + actionName}
            attr={'button-array'}
            variant="contained"
            color="primary"
            onClick={async () => {
              setIsOpen(false);
              await handleResult(await editEnglishWordMeanAPI({ editMeanData }));
            }}
          />
          <Button
            label={'意味削除'}
            attr={'button-array'}
            variant="contained"
            color="primary"
            disabled={meanIndex === -1}
            onClick={async () => {
              setIsOpen(false);
              await handleResult(await deleteEnglishMeanAPI({ deleteMeanData: { meanId: editMeanData.meanId } }));
            }}
          />
        </>
      }
    >
      <Typography component="div">
        品詞：
        {/* 品詞プルダウン */}
        <Select
          inputProps={{ 'aria-label': '品詞' }}
          id="edit-pos-select"
          value={editMeanData.partofspeechId || -1}
          sx={{ width: 1 }}
          MenuProps={pullDownMenuProps}
          onChange={(e) => {
            // 「選択なし」を選んだ場合は、選択済みの品詞を残す
            if (posList.some((x) => +x.value === +e.target.value)) {
              setEditMeanData({
                ...editMeanData,
                partofspeechId: +e.target.value
              });
            }
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {posList.map((x) => (
            <MenuItem value={x.value} key={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
      </Typography>
      <Typography component="div" sx={{ mt: 2 }}>
        意味：
        <TextField
          inputProps={{ 'aria-label': '意味' }}
          variant="outlined"
          value={editMeanData.meaning}
          onChange={(e) => {
            setEditMeanData({
              ...editMeanData,
              meaning: e.target.value
            });
          }}
        />
      </Typography>
    </DialogModal>
  );
};
