import { Card, CardContent, FormControl, FormGroup, Paper, TextField, Typography } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import {
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto,
  initGetQuizRequestData,
  initGetQuizResponseData
} from 'quizzer-lib';
import { useState } from 'react';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { deleteQuizAPI, getQuizAPI } from '@/utils/api-wrapper';

interface DeleteQuizFormProps {
  deleteQuizInfo: GetQuizApiResponseDto;
  setDeleteQuizInfo: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
}

export const DeleteQuizForm = ({ deleteQuizInfo, setDeleteQuizInfo }: DeleteQuizFormProps) => {
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const setMessage = useSetRecoilState(messageState);

  return (
    <Paper variant="outlined" className="w-full md:w-2/5 float-none md:float-left m-[5px]">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6">
            削除する(統合元の)問題
          </Typography>

          <FormGroup>
            <QuizFilePullDown
              value={getQuizRequestData.file_num}
              onFileChange={(e) => {
                setQuizRequestData({
                  ...getQuizRequestData,
                  file_num: +e.target.value
                });
              }}
            />

            <FormControl>
              <TextField
                label="問題番号"
                value={getQuizRequestData.quiz_num === -1 ? '' : getQuizRequestData.quiz_num}
                onChange={(e) => {
                  setQuizRequestData({
                    ...getQuizRequestData,
                    quiz_num: +e.target.value
                  });
                }}
              />
            </FormControl>
          </FormGroup>

          <Button
            label={'問題取得'}
            disabled={getQuizRequestData.file_num === -1}
            attr={'button-array'}
            variant="contained"
            color="primary"
            onClick={async (e) => {
              setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
              const result = await getQuizAPI({ getQuizRequestData });
              setMessage(result.message);
              if (result.result) {
                setDeleteQuizInfo({ ...(result.result as GetQuizApiResponseDto) });
              }
            }}
          />

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px] border-0">
            ファイル：{deleteQuizInfo.file_num === -1 ? '' : deleteQuizInfo.file_num}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px] border-0">
            問題番号：{deleteQuizInfo.quiz_num === -1 ? '' : deleteQuizInfo.quiz_num}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px] border-0">
            問題　　：{deleteQuizInfo.quiz_sentense}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px] border-0">
            答え　　：{deleteQuizInfo.answer}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px] border-0">
            カテゴリ：
            {deleteQuizInfo.quiz_category
              ?.map((x) => {
                return x.category;
              })
              .join(',')}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px] border-0">
            画像　　：{deleteQuizInfo.img_file}
          </Typography>
        </CardContent>
      </Card>

      <Button
        label={'削除'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        disabled={deleteQuizInfo.quiz_num === -1}
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await deleteQuizAPI({
            deleteQuizAPIRequestData: {
              file_num: deleteQuizInfo.file_num,
              quiz_num: deleteQuizInfo.quiz_num
            }
          });
          setMessage(result.message);
          if (result.message.messageColor === 'success.light') {
            setQuizRequestData(initGetQuizRequestData);
            setDeleteQuizInfo(initGetQuizResponseData);
          }
        }}
      />
    </Paper>
  );
};
