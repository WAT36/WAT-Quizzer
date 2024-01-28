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
import {
  IntegrateToQuizInfoState,
  MessageState,
  PullDownOptionState,
  QueryOfIntegrateToQuizState
} from '../../../../../../interfaces/state';
import { getIntegrateToQuiz, integrateQuiz } from '@/common/ButtonAPI';

interface IntegrateToQuizFormProps {
  queryOfIntegrateToQuizState: QueryOfIntegrateToQuizState;
  integrateToQuizInfoState: IntegrateToQuizInfoState;
  filelistoption: PullDownOptionState[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setQueryOfIntegrateToQuizState?: React.Dispatch<React.SetStateAction<QueryOfIntegrateToQuizState>>;
  setIntegrateToQuizInfoState?: React.Dispatch<React.SetStateAction<IntegrateToQuizInfoState>>;
}

export const IntegrateToQuizForm = ({
  queryOfIntegrateToQuizState,
  integrateToQuizInfoState,
  filelistoption,
  setMessage,
  setQueryOfIntegrateToQuizState,
  setIntegrateToQuizInfoState
}: IntegrateToQuizFormProps) => {
  // ラジオボタンの選択変更時の処理
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            統合先の問題
          </Typography>

          <FormGroup>
            <FormControl>
              <PullDown
                label={'問題ファイル'}
                optionList={filelistoption}
                onChange={(e) => {
                  setQueryOfIntegrateToQuizState &&
                    setQueryOfIntegrateToQuizState({
                      ...queryOfIntegrateToQuizState,
                      fileNum: Number(e.target.value)
                    });
                }}
              />
            </FormControl>

            <FormControl>
              <TextField
                label="問題番号"
                onChange={(e) => {
                  setQueryOfIntegrateToQuizState &&
                    setQueryOfIntegrateToQuizState({
                      ...queryOfIntegrateToQuizState,
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
                value={queryOfIntegrateToQuizState.format}
                defaultValue={queryOfIntegrateToQuizState.format}
                onChange={handleRadioChange}
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
            disabled={queryOfIntegrateToQuizState.format !== 'basic'}
            onClick={(e) =>
              getIntegrateToQuiz({ queryOfIntegrateToQuizState, setMessage, setIntegrateToQuizInfoState })
            }
          />

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            ファイル：{integrateToQuizInfoState.fileNum}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            問題番号：{integrateToQuizInfoState.quizNum}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            問題　　：{integrateToQuizInfoState.sentense}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            答え　　：{integrateToQuizInfoState.answer}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            カテゴリ：{integrateToQuizInfoState.category}
          </Typography>

          <Typography variant="h6" component="h6" className={styles.questionInfo}>
            画像　　：{integrateToQuizInfoState.image}
          </Typography>
        </CardContent>
      </Card>

      <Button
        label={'統合'}
        variant="contained"
        color="primary"
        disabled={queryOfIntegrateToQuizState.format !== 'basic'}
        onClick={(e) =>
          integrateQuiz({
            queryOfIntegrateToQuizState,
            setMessage,
            setQueryOfIntegrateToQuizState,
            setIntegrateToQuizInfoState
          })
        }
      />
    </Paper>
  );
};
