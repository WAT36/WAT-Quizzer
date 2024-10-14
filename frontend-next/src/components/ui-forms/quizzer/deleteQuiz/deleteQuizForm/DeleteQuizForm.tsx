import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { Card, CardContent, FormControl, FormGroup, FormLabel, Paper, TextField, Typography } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import styles from '../DeleteQuizForm.module.css';
import {
  deleteQuiz,
  getQuizAPI,
  GetQuizAPIRequestDto,
  GetQuizApiResponseDto,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  GetQuizFormatApiResponseDto,
  initGetQuizRequestData,
  initGetQuizResponseData,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import { useEffect, useState } from 'react';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';

interface DeleteQuizFormProps {
  deleteQuizInfo: GetQuizApiResponseDto;
  quizFormatListoption: GetQuizFormatApiResponseDto[];
  setDeleteQuizInfo: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
}

export const DeleteQuizForm = ({ deleteQuizInfo, quizFormatListoption, setDeleteQuizInfo }: DeleteQuizFormProps) => {
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFileListAPI();
      setMessage(result.message);
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    })();
  }, [setMessage]);

  return (
    <Paper variant="outlined" className={styles.form}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6">
            削除する(統合元の)問題
          </Typography>

          <FormGroup>
            <PullDown
              label={'問題ファイル'}
              optionList={filelistoption}
              onChange={(e) => {
                setQuizRequestData({
                  ...getQuizRequestData,
                  file_num: +e.target.value
                });
              }}
            />

            <FormControl>
              <TextField
                label="問題番号"
                onChange={(e) => {
                  setQuizRequestData({
                    ...getQuizRequestData,
                    quiz_num: +e.target.value
                  });
                }}
              />
            </FormControl>

            <FormControl>
              <RadioGroupSection
                sectionTitle={'問題種別'}
                radioGroupProps={{
                  radioButtonProps: quizFormatListoption.map((x) => {
                    return {
                      value: String(x.id),
                      label: x.name
                    };
                  }),
                  defaultValue: '1',
                  setQueryofQuizStater: (value: string) => {
                    setQuizRequestData({
                      ...getQuizRequestData,
                      format_id: +value
                    });
                  }
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

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            ファイル：{deleteQuizInfo.file_num === -1 ? '' : deleteQuizInfo.file_num}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            問題番号：{deleteQuizInfo.quiz_num === -1 ? '' : deleteQuizInfo.quiz_num}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            問題　　：{deleteQuizInfo.quiz_sentense}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            答え　　：{deleteQuizInfo.answer}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            カテゴリ：
            {deleteQuizInfo.quiz_category
              ?.map((x) => {
                return x.category;
              })
              .join(',')}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            画像　　：{deleteQuizInfo.img_file}
          </Typography>
        </CardContent>
      </Card>

      <Button
        label={'削除'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await deleteQuiz({
            deleteQuizAPIRequestData: {
              file_num: deleteQuizInfo.file_num,
              quiz_num: deleteQuizInfo.quiz_num,
              format_id: deleteQuizInfo.format_id
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
