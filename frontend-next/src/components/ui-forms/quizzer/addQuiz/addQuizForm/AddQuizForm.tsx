import React, { useState } from 'react';
import { Card, CardContent, FormGroup, IconButton, Input, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { AddQuizAPIRequestDto, AddQuizApiResponseDto, GetQuizApiResponseDto, initAddQuizRequestData, insertAtArray } from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { Button } from '@/components/ui-elements/button/Button';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { useQuizFormatList } from '@/hooks/useQuizFormatList';
import { addQuizAPI, searchQuizAPI } from '@/utils/api-wrapper';
import { DuplicateAnswerModal } from '../duplicateAnswerModal/DuplicateAnswerModal';

interface AddQuizFormProps {
  setAddLog: React.Dispatch<React.SetStateAction<string>>;
}

export const AddQuizForm = ({ setAddLog }: AddQuizFormProps) => {
  const { quizFormatListoption } = useQuizFormatList();
  const [addQuizRequestData, setAddQuizRequestData] = useState<AddQuizAPIRequestDto>(initAddQuizRequestData);
  const setMessage = useSetRecoilState(messageState);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateQuizzes, setDuplicateQuizzes] = useState<GetQuizApiResponseDto[]>([]);

  const executeAddQuiz = async () => {
    setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
    const result = await addQuizAPI({ addQuizRequestData });
    setMessage(result.message);
    setAddLog(result.result ? (result.result as AddQuizApiResponseDto).log : '');
    result.message.messageColor === 'success.light' &&
      setAddQuizRequestData({
        ...initAddQuizRequestData,
        format_id: addQuizRequestData.format_id,
        file_num: addQuizRequestData.file_num
      });
  };

  const handleRegisterClick = async () => {
    if (addQuizRequestData.answer && addQuizRequestData.file_num !== -1) {
      setMessage({ message: '重複確認中...', messageColor: '#d3d3d3', isDisplay: true });
      const searchResult = await searchQuizAPI({
        searchQuizRequestData: {
          query: addQuizRequestData.answer,
          file_num: addQuizRequestData.file_num,
          searchInOnlyAnswer: true
        }
      });
      setMessage({ message: '', messageColor: '', isDisplay: false });
      const hits = (searchResult.result as GetQuizApiResponseDto[] | undefined) ?? [];
      if (hits.length > 0) {
        setDuplicateQuizzes(hits);
        setDuplicateModalOpen(true);
        return;
      }
    }
    await executeAddQuiz();
  };

  return (
    <>
      <FormGroup>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              追加する問題（問題種別,問題文,正解,カテゴリ,画像ファイル名,関連基礎問題番号,解説,ダミー選択肢）
            </Typography>

            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              <label>問題ファイル：</label>
              <QuizFilePullDown
                onFileChange={(e: SelectChangeEvent<number | string>) => {
                  setAddQuizRequestData((prev: any) => ({
                    ...prev,
                    file_num: +e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              <label>問題種別：</label>
              <RadioGroupSection
                sectionTitle={''}
                radioGroupProps={{
                  radioButtonProps: quizFormatListoption.map((x) => {
                    return {
                      value: String(x.id),
                      label: x.name
                    };
                  }),
                  defaultValue: '1',
                  setQueryofQuizStater: (value: string) => {
                    setAddQuizRequestData((prev: any) => ({
                      ...prev,
                      format_id: +value
                    }));
                  }
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              <label htmlFor="question">問題文　：</label>
              <Input
                fullWidth
                maxRows={1}
                id="question"
                value={addQuizRequestData.question || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: AddQuizAPIRequestDto) => ({
                    ...prev,
                    question: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              <label htmlFor="answer">答え　　：</label>
              <Input
                fullWidth
                maxRows={1}
                id="answer"
                value={addQuizRequestData.answer || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: AddQuizAPIRequestDto) => ({
                    ...prev,
                    answer: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              <label htmlFor="category">カテゴリ：</label>
              <Input
                fullWidth
                maxRows={1}
                id="category"
                value={addQuizRequestData.category || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: AddQuizAPIRequestDto) => ({
                    ...prev,
                    category: e.target.value
                  }));
                }}
              />
              <p className="text-xs">※カテゴリはカンマ(,)区切りで書くこと</p>
            </Typography>

            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              <label htmlFor="imgFile">画像ファイル名：</label>
              <Input
                fullWidth
                maxRows={1}
                id="imgFile"
                value={addQuizRequestData.img_file || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: AddQuizAPIRequestDto) => ({
                    ...prev,
                    img_file: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              <label htmlFor="relatedBasisNum">関連基礎問題番号(カンマ区切りで問題番号を指定)：</label>
              <Input
                fullWidth
                disabled={addQuizRequestData.format_id === 1}
                maxRows={1}
                id="relatedBasisNum"
                value={addQuizRequestData.matched_basic_quiz_id || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: AddQuizAPIRequestDto) => ({
                    ...prev,
                    matched_basic_quiz_id: e.target.value
                  }));
                }}
              />
            </Typography>

            <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
              <label htmlFor="description">解説：</label>
              <Input
                fullWidth
                maxRows={1}
                id="description"
                value={addQuizRequestData.explanation || ''}
                onChange={(e) => {
                  setAddQuizRequestData((prev: AddQuizAPIRequestDto) => ({
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

            {addQuizRequestData.format_id === 3 && addQuizRequestData.dummyChoice && (
              <>
                {addQuizRequestData.dummyChoice.map((choice, index) => {
                  const inputId = 'dummy' + (index + 1);
                  return (
                    <>
                      <Typography variant="h6" component="h6" className="!my-[10px] !mx-0 border-none">
                        <label htmlFor={inputId}>{`ダミー選択肢${index + 1}：`}</label>
                        <Checkbox
                          value="only-checked"
                          label="(多答設定、この選択肢も正解にする)"
                          onChange={(e) => {
                            setAddQuizRequestData((prev: AddQuizAPIRequestDto) => ({
                              ...prev,
                              dummyChoice: insertAtArray(prev.dummyChoice!, index, {
                                ...prev.dummyChoice![index],
                                isCorrect: e.target.checked
                              })
                            }));
                          }}
                        />
                        <Input
                          fullWidth
                          disabled={addQuizRequestData.format_id !== 3}
                          maxRows={1}
                          id={inputId}
                          value={choice.sentense || ''}
                          onChange={(e) => {
                            setAddQuizRequestData((prev: AddQuizAPIRequestDto) => ({
                              ...prev,
                              dummyChoice: insertAtArray(prev.dummyChoice!, index, {
                                ...prev.dummyChoice![index],
                                sentense: e.target.value
                              })
                            }));
                          }}
                        />
                      </Typography>
                    </>
                  );
                })}
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                  <IconButton
                    aria-label="ダミー選択肢追加"
                    onClick={() => {
                      setAddQuizRequestData({
                        ...addQuizRequestData,
                        dummyChoice: addQuizRequestData.dummyChoice?.concat([
                          {
                            sentense: '',
                            isCorrect: false
                          }
                        ])
                      });
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      </FormGroup>
      <Button
        label="問題登録"
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={handleRegisterClick}
      />

      <DuplicateAnswerModal
        isOpen={duplicateModalOpen}
        setIsOpen={setDuplicateModalOpen}
        duplicateQuizzes={duplicateQuizzes}
        answer={addQuizRequestData.answer ?? ''}
        onConfirm={async () => {
          setDuplicateModalOpen(false);
          await executeAddQuiz();
        }}
      />
    </>
  );
};
