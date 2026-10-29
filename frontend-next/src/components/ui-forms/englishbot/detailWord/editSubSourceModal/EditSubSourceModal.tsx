import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import type { ApiResult, EditWordSubSourceAPIRequestDto, GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { DialogModal } from '@/components/ui-parts/dialogModal/DialogModal';
import { deleteEnglishWordSubSourceAPI, editEnglishWordSubSourceAPI } from '@/utils/api-wrapper';

interface EditSubSourceModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // 編集するサブ出典のwordDetail.word_subsource内のindex（-1は新規追加）
  subSourceIndex: number;
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

// 編集対象のサブ出典から入力の初期値を作る
const createEditWordSubSourceData = (
  wordDetail: GetWordDetailAPIResponseDto,
  subSourceIndex: number
): EditWordSubSourceAPIRequestDto => ({
  id: subSourceIndex === -1 ? -1 : wordDetail.word_subsource[subSourceIndex].id,
  wordId: wordDetail.id,
  subSource: subSourceIndex === -1 ? '' : wordDetail.word_subsource[subSourceIndex].subsource
});

// 単語詳細画面でサブ出典を追加・更新・削除するモーダル
// 入力の初期値はマウント時に作るため、呼び出し側では開いている間だけ描画する
export const EditSubSourceModal = ({
  isOpen,
  setIsOpen,
  subSourceIndex,
  wordDetail,
  setMessage,
  onUpdated
}: EditSubSourceModalProps) => {
  const [editWordSubSourceData, setEditWordSubSourceData] = useState<EditWordSubSourceAPIRequestDto>(() =>
    createEditWordSubSourceData(wordDetail, subSourceIndex)
  );
  const actionName = subSourceIndex === -1 ? '追加' : '更新';

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
      title={'サブ出典' + actionName}
      actions={
        <>
          <Button
            label={'サブ出典' + actionName}
            attr={'button-array'}
            variant="contained"
            color="primary"
            onClick={async () => {
              setIsOpen(false);
              await handleResult(await editEnglishWordSubSourceAPI({ editWordSubSourceData }));
            }}
          />
          <Button
            label={'サブ出典削除'}
            attr={'button-array'}
            variant="contained"
            color="primary"
            disabled={subSourceIndex === -1}
            onClick={async () => {
              setIsOpen(false);
              await handleResult(
                await deleteEnglishWordSubSourceAPI({ deleteWordSubSourceData: { id: editWordSubSourceData.id } })
              );
            }}
          />
        </>
      }
    >
      <Typography component="div">
        サブ出典：
        <TextField
          inputProps={{ 'aria-label': 'サブ出典' }}
          variant="outlined"
          value={editWordSubSourceData.subSource}
          onChange={(e) => {
            setEditWordSubSourceData({
              ...editWordSubSourceData,
              subSource: e.target.value
            });
          }}
        />
      </Typography>
    </DialogModal>
  );
};
