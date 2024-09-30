import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import styles from '../DeleteQuizForm.module.css';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { Button } from '@/components/ui-elements/button/Button';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import {
  GetQuizAPIRequestDto,
  initGetQuizRequestData,
  GetQuizApiResponseDto,
  initGetQuizResponseData,
  getQuizAPI,
  integrateQuizAPI
} from 'quizzer-lib';

interface IntegrateToQuizFormProps {
  deleteQuizInfo: GetQuizApiResponseDto;
  setDeleteQuizInfo: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
}

export const IntegrateToQuizForm = ({ deleteQuizInfo, setDeleteQuizInfo }: IntegrateToQuizFormProps) => {
  //const [integrateToQuizInfoState, setIntegrateToQuizInfoState] = useState<IntegrateToQuizInfoState>({});
  const [getQuizRequestData, setQuizRequestData] = useState<GetQuizAPIRequestDto>(initGetQuizRequestData);
  const [getQuizResponseData, setQuizResponseData] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  const setMessage = useSetRecoilState(messageState);

  return (
    <Paper variant="outlined" className={styles.form}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6">
            統合先の問題
          </Typography>

          <FormGroup>
            <FormControl disabled>
              <PullDown label={'問題ファイル'} optionList={[{ value: -1, label: '同左' }]} onChange={(e) => {}} />
            </FormControl>

            <FormControl>
              <TextField
                label="問題番号"
                disabled={!(deleteQuizInfo.format === 'basic' || deleteQuizInfo.format === 'applied')}
                onChange={(e) => {
                  setQuizRequestData({
                    ...getQuizRequestData,
                    file_num: deleteQuizInfo.file_num,
                    quiz_num: +e.target.value
                  });
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">問題種別</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={deleteQuizInfo.format}
                defaultValue={deleteQuizInfo.format}
              >
                <FormControlLabel disabled value="basic" control={<Radio />} label="基礎問題" />
                <FormControlLabel disabled value="applied" control={<Radio />} label="応用問題" />
              </RadioGroup>
            </FormControl>
          </FormGroup>

          <Button
            label={'問題取得'}
            attr={'button-array'}
            variant="contained"
            color="primary"
            disabled={deleteQuizInfo.format !== 'basic'}
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
                setQuizResponseData({ ...(result.result as GetQuizApiResponseDto), format: getQuizRequestData.format });
              }
            }}
          />

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            ファイル：{getQuizResponseData.file_num === -1 ? '' : getQuizResponseData.file_num}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            問題番号：{getQuizResponseData.quiz_num === -1 ? '' : getQuizResponseData.quiz_num}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            問題　　：{getQuizResponseData.quiz_sentense}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            答え　　：{getQuizResponseData.answer}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            カテゴリ：
            {getQuizResponseData.quiz_category
              ?.map((x) => {
                return x.category;
              })
              .join(',')}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            画像　　：{getQuizResponseData.img_file}
          </Typography>
        </CardContent>
      </Card>

      <Button
        label={'統合'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        disabled={deleteQuizInfo.format !== 'basic'}
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await integrateQuizAPI({
            integrateToQuizAPIRequestData: {
              file_num: deleteQuizInfo.file_num,
              fromQuizInfo: {
                quiz_num: deleteQuizInfo.quiz_num
              },
              toQuizInfo: {
                quiz_num: getQuizResponseData.quiz_num
              }
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
