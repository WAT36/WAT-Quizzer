import { Card, CardContent, FormControl, FormGroup, Paper, TextField, Typography } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { Button } from '@/components/ui-elements/button/Button';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import {
  GetQuizAPIRequestDto,
  initGetQuizRequestData,
  GetQuizApiResponseDto,
  initGetQuizResponseData
} from 'quizzer-lib';
import { integrateQuizAPI, getQuizAPI } from '@/utils/api-wrapper';

interface IntegrateToQuizFormProps {
  deleteQuizInfo: GetQuizApiResponseDto;
  setDeleteQuizInfo: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
}

export const IntegrateToQuizForm = ({ deleteQuizInfo, setDeleteQuizInfo }: IntegrateToQuizFormProps) => {
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const [getQuizResponseData, setQuizResponseData] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  const setMessage = useSetRecoilState(messageState);

  return (
    <Paper variant="outlined" className="w-full md:w-2/5 float-none md:float-left m-[5px]">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6">
            統合先の問題
          </Typography>

          <FormGroup>
            {/* 統合先は常に統合元と同じファイルのため、選べないようにしている */}
            <PullDown label={'問題ファイル'} optionList={[{ value: -1, label: '同左' }]} onChange={(e) => {}} disabled />
            <FormControl>
              <TextField
                label="問題番号"
                value={getQuizRequestData.quiz_num === -1 ? '' : getQuizRequestData.quiz_num}
                onChange={(e) => {
                  setQuizRequestData({
                    ...getQuizRequestData,
                    file_num: deleteQuizInfo.file_num,
                    quiz_num: +e.target.value
                  });
                }}
              />
            </FormControl>
          </FormGroup>

          <Button
            label={'問題取得'}
            attr={'button-array'}
            variant="contained"
            color="primary"
            disabled={getQuizRequestData.file_num === -1}
            onClick={async (e) => {
              setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
              const result = await getQuizAPI({
                getQuizRequestData: {
                  ...getQuizRequestData,
                  file_num: deleteQuizInfo.file_num
                }
              });
              setMessage(result.message);
              if (result.result) {
                setQuizResponseData({ ...(result.result as GetQuizApiResponseDto) });
              }
            }}
          />

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px]">
            ファイル：{getQuizResponseData.file_num === -1 ? '' : getQuizResponseData.file_num}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px]">
            問題番号：{getQuizResponseData.quiz_num === -1 ? '' : getQuizResponseData.quiz_num}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px]">
            問題　　：{getQuizResponseData.quiz_sentense}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px]">
            答え　　：{getQuizResponseData.answer}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px]">
            カテゴリ：
            {getQuizResponseData.quiz_category
              ?.map((x) => {
                return x.category;
              })
              .join(',')}
          </Typography>

          <Typography variant="h6" component="h6" className="mt-[10px] mb-[20px]">
            画像　　：{getQuizResponseData.img_file}
          </Typography>
        </CardContent>
      </Card>

      <Button
        label={'統合'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        disabled={getQuizResponseData.quiz_num === -1}
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await integrateQuizAPI({
            integrateToQuizAPIRequestData: {
              fromQuizId: deleteQuizInfo.id,
              toQuizId: getQuizResponseData.id
            }
          });
          setMessage(result.message);
          if (result.message.messageColor === 'success.light') {
            setQuizRequestData(initGetQuizRequestData);
            setQuizResponseData(initGetQuizResponseData);
            setDeleteQuizInfo(initGetQuizResponseData);
          }
        }}
      />
    </Paper>
  );
};
