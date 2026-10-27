import React from 'react';
import { CardContent, Input, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import type { EditQuizAPIRequestDto } from 'quizzer-lib';
import { initEditQuizRequestData, insertAtArray } from 'quizzer-lib';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { editQuizAPI } from '@/utils/api-wrapper';
import { expandCategoriesWithAncestors } from '@/utils/categoryUtils';

interface EditQuizFormProps {
  editQuizRequestData: EditQuizAPIRequestDto;
  setEditQuizRequestData: React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

export const EditQuizForm = ({ editQuizRequestData, setEditQuizRequestData }: EditQuizFormProps) => {
  const setMessage = useSetRecoilState(messageState);
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6" className="!my-[10px] border-none">
            編集する問題（問題文,正解,カテゴリ,画像ファイル名,関連基礎問題番号,解説,ダミー選択肢）
          </Typography>

          <Typography variant="h6" component="h6" className="!my-[10px] border-none">
            <label htmlFor="question">問題文　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="question"
              value={editQuizRequestData.question || ''}
              onChange={(e) => {
                // TODO ここのany
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  question: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className="!my-[10px] border-none">
            <label htmlFor="answer">答え　　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="answer"
              value={editQuizRequestData.answer || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  answer: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className="!my-[10px] border-none">
            <label htmlFor="category">カテゴリ：</label>
            <Input
              fullWidth
              maxRows={1}
              id="category"
              value={editQuizRequestData.category || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  category: e.target.value
                }));
              }}
            />
            <p className="text-xs">※カテゴリはカンマ(,)区切りで書くこと</p>
          </Typography>

          <Typography variant="h6" component="h6" className="!my-[10px] border-none">
            <label htmlFor="imgFile">画像ファイル名：</label>
            <Input
              fullWidth
              maxRows={1}
              id="imgFile"
              value={editQuizRequestData.img_file || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  img_file: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className="!my-[10px] border-none">
            <label htmlFor="relatedBasisNum">関連基礎問題番号(カンマ区切りで問題番号を指定)：</label>
            <Input
              fullWidth
              disabled={editQuizRequestData.format_id === 1}
              maxRows={1}
              id="relatedBasisNum"
              value={editQuizRequestData.matched_basic_quiz_id || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  matched_basic_quiz_id: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className="!my-[10px] border-none">
            <label htmlFor="description">解説：</label>
            <Input
              fullWidth
              maxRows={1}
              id="description"
              value={editQuizRequestData.explanation || ''}
              onChange={(e) => {
                setEditQuizRequestData((prev: any) => ({
                  ...prev,
                  explanation: e.target.value
                }));
              }}
            />
            <p className="text-xs">
              ※選択肢を示したいときは正解文を<b>{'{c}'}</b>、ダミー選択肢１、２、３をそれぞれ<b>{'{d1},{d2},{d3}'}</b>
              で書くこと
            </p>
          </Typography>

          {editQuizRequestData.format_id === 3 &&
            editQuizRequestData.dummyChoice &&
            editQuizRequestData.dummyChoice.map((choice, index) => {
              const inputId = 'dummy' + (index + 1);
              return (
                <>
                  <Typography variant="h6" component="h6" className="!my-[10px] border-none">
                    <label htmlFor={inputId}>{`ダミー選択肢${index + 1}：`}</label>
                    <Checkbox
                      value="only-checked"
                      label="(多答設定、この選択肢も正解にする)"
                      defaultChecked={
                        editQuizRequestData.dummyChoice ? editQuizRequestData.dummyChoice[index].isCorrect : false
                      }
                      onChange={(e) => {
                        setEditQuizRequestData((prev: any) => ({
                          ...prev,
                          dummyChoice: insertAtArray(prev.dummyChoice, index, {
                            ...prev.dummyChoice[index],
                            isCorrect: e.target.checked
                          })
                        }));
                      }}
                    />
                    <Input
                      fullWidth
                      disabled={editQuizRequestData.format_id !== 3}
                      maxRows={1}
                      id={inputId}
                      value={choice.sentense || ''}
                      onChange={(e) => {
                        setEditQuizRequestData((prev: any) => ({
                          ...prev,
                          dummyChoice: insertAtArray(prev.dummyChoice, index, {
                            ...prev.dummyChoice[index],
                            sentense: e.target.value
                          })
                        }));
                      }}
                    />
                  </Typography>
                </>
              );
            })}
        </CardContent>
      </Card>
      <Button
        label={'更新'}
        disabled={editQuizRequestData.quiz_id === -1}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          // カテゴリを祖先カテゴリも含めて展開してから送信
          let expandedCategory = editQuizRequestData.category;
          if (editQuizRequestData.category && editQuizRequestData.file_num !== -1) {
            const categories = editQuizRequestData.category.split(',').map((s) => s.trim()).filter(Boolean);
            const expanded = await expandCategoriesWithAncestors(categories, editQuizRequestData.file_num);
            expandedCategory = expanded.join(',');
          }
          const result = await editQuizAPI({ editQuizRequestData: { ...editQuizRequestData, category: expandedCategory } });
          setMessage(result.message);
          if (result.isSuccess) {
            setEditQuizRequestData({
              ...initEditQuizRequestData,
              file_num: editQuizRequestData.file_num,
              quiz_num: editQuizRequestData.quiz_num
            });
          }
        }}
      />
    </>
  );
};
