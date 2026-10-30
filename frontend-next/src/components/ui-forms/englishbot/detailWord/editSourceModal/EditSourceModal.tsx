import React, { useState } from 'react';
import { MenuItem, Select, Typography } from '@mui/material';
import type {
  ApiResult,
  EditWordSourceAPIRequestDto,
  GetWordDetailAPIResponseDto,
  Message,
  PullDownOptionDto
} from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { DialogModal } from '@/components/ui-parts/dialogModal/DialogModal';
import { PULLDOWN_NONE_VALUE, pullDownMenuProps } from '@/constants/pullDown';
import { deleteEnglishWordSourceAPI, editEnglishWordSourceAPI } from '@/utils/api-wrapper';

interface EditSourceModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // 編集する出典のwordDetail.word_source内のindex（-1は新規追加）
  sourceIndex: number;
  sourceList: PullDownOptionDto[];
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

// 編集対象の出典から入力の初期値を作る
// TODO word-sourceの構造変えたらここも直したい
const createEditWordSourceData = (
  wordDetail: GetWordDetailAPIResponseDto,
  sourceIndex: number
): EditWordSourceAPIRequestDto => {
  const sourceId = sourceIndex === -1 ? PULLDOWN_NONE_VALUE : wordDetail.word_source[sourceIndex].source.id;
  return { wordId: wordDetail.id, oldSourceId: sourceId, newSourceId: sourceId };
};

// 単語詳細画面で出典を追加・更新・削除するモーダル
// 入力の初期値はマウント時に作るため、呼び出し側では開いている間だけ描画する
export const EditSourceModal = ({
  isOpen,
  setIsOpen,
  sourceIndex,
  sourceList,
  wordDetail,
  setMessage,
  onUpdated
}: EditSourceModalProps) => {
  const [editWordSourceData, setEditWordSourceData] = useState<EditWordSourceAPIRequestDto>(() =>
    createEditWordSourceData(wordDetail, sourceIndex)
  );
  const actionName = sourceIndex === -1 ? '追加' : '更新';

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
      title={'出典' + actionName}
      actions={
        <>
          <Button
            label={'出典' + actionName}
            attr={'button-array'}
            variant="contained"
            color="primary"
            onClick={async () => {
              setIsOpen(false);
              await handleResult(await editEnglishWordSourceAPI({ editWordSourceData }));
            }}
          />
          <Button
            label={'出典削除'}
            attr={'button-array'}
            variant="contained"
            color="primary"
            disabled={sourceIndex === -1}
            onClick={async () => {
              setIsOpen(false);
              await handleResult(
                await deleteEnglishWordSourceAPI({
                  deleteWordSourceData: { word_id: wordDetail.id, source_id: editWordSourceData.oldSourceId }
                })
              );
            }}
          />
        </>
      }
    >
      <Typography component="div">
        出典：
        <Select
          inputProps={{ 'aria-label': '出典' }}
          id="edit-source-select"
          value={editWordSourceData.newSourceId}
          sx={{ width: 1 }}
          MenuProps={pullDownMenuProps}
          onChange={(e) => {
            setEditWordSourceData({
              ...editWordSourceData,
              newSourceId: +e.target.value
            });
          }}
        >
          <MenuItem value={PULLDOWN_NONE_VALUE}>選択なし</MenuItem>
          {sourceList.map((x) => (
            <MenuItem value={x.value} key={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
      </Typography>
    </DialogModal>
  );
};
