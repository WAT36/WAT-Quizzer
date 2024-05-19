import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
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
import {
  DeleteQuizInfoState,
  MessageState,
  PullDownOptionState,
  QueryOfDeleteQuizState,
  QueryOfIntegrateToQuizState
} from '../../../../../../interfaces/state';
import { Button } from '@/components/ui-elements/button/Button';
import styles from '../DeleteQuizForm.module.css';
import { getDeletingQuiz } from '@/api/quiz/getDeletingQuizAPI';
import { deleteQuiz } from '@/api/quiz/deleteQuizAPI';

interface DeleteQuizFormProps {
  queryOfDeleteQuizState: QueryOfDeleteQuizState;
  queryOfIntegrateToQuizState: QueryOfIntegrateToQuizState;
  deleteQuizInfoState: DeleteQuizInfoState;
  filelistoption: PullDownOptionState[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryOfDeleteQuizState?: React.Dispatch<React.SetStateAction<QueryOfDeleteQuizState>>;
  setDeleteQuizInfoState?: React.Dispatch<React.SetStateAction<DeleteQuizInfoState>>;
  setQueryOfIntegrateToQuizState?: React.Dispatch<React.SetStateAction<QueryOfIntegrateToQuizState>>;
}

export const DeleteQuizForm = ({
  queryOfDeleteQuizState,
  queryOfIntegrateToQuizState,
  deleteQuizInfoState,
  filelistoption,
  setMessage,
  setQueryOfDeleteQuizState,
  setDeleteQuizInfoState,
  setQueryOfIntegrateToQuizState
}: DeleteQuizFormProps) => {
  // ラジオボタンの選択変更時の処理
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryOfDeleteQuizState &&
      setQueryOfDeleteQuizState({
        ...queryOfDeleteQuizState,
        format: (event.target as HTMLInputElement).value
      });
    setQueryOfIntegrateToQuizState &&
      setQueryOfIntegrateToQuizState({
        ...queryOfIntegrateToQuizState,
        format: (event.target as HTMLInputElement).value
      });
  };

  return (
    <Paper variant="outlined" className={styles.form}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6">
            削除する(統合元の)問題
          </Typography>

          <FormGroup>
            <FormControl>
              <PullDown
                label={'問題ファイル'}
                optionList={filelistoption}
                onChange={(e) => {
                  setQueryOfDeleteQuizState &&
                    setQueryOfDeleteQuizState({
                      ...queryOfDeleteQuizState,
                      fileNum: Number(e.target.value)
                    });
                  setQueryOfIntegrateToQuizState &&
                    setQueryOfIntegrateToQuizState({
                      ...queryOfIntegrateToQuizState,
                      fileNum: Number(e.target.value),
                      quizNum: -1
                    });
                }}
              />
            </FormControl>

            <FormControl>
              <TextField
                label="問題番号"
                onChange={(e) => {
                  setQueryOfDeleteQuizState &&
                    setQueryOfDeleteQuizState({
                      ...queryOfDeleteQuizState,
                      quizNum: Number(e.target.value)
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
                value={queryOfDeleteQuizState.format}
                defaultValue="basic"
                onChange={handleRadioChange}
              >
                <FormControlLabel value="basic" control={<Radio />} label="基礎問題" />
                <FormControlLabel value="applied" control={<Radio />} label="応用問題" />
                <FormControlLabel value="4choice" control={<Radio />} label="四択問題" />
              </RadioGroup>
            </FormControl>
          </FormGroup>

          <Button
            label={'問題取得'}
            attr={'button-array'}
            variant="contained"
            color="primary"
            onClick={(e) => getDeletingQuiz({ queryOfDeleteQuizState, setMessage, setDeleteQuizInfoState })}
          />

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            ファイル：{deleteQuizInfoState.fileNum}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            問題番号：{deleteQuizInfoState.quizNum}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            問題　　：{deleteQuizInfoState.sentense}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            答え　　：{deleteQuizInfoState.answer}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            カテゴリ：{deleteQuizInfoState.category}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            画像　　：{deleteQuizInfoState.image}
          </Typography>
        </CardContent>
      </Card>

      <Button
        label={'削除'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) =>
          deleteQuiz({
            queryOfDeleteQuizState,
            setMessage,
            setQueryOfDeleteQuizState,
            setDeleteQuizInfoState
          })
        }
      />
    </Paper>
  );
};
