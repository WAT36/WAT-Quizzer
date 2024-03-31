import styles from '../Settings.module.css';
import { CardContent, CardHeader } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import { MessageState, PullDownOptionState } from '../../../../../../interfaces/state';
import { post } from '@/common/API';
import { ProcessingApiReponse } from '../../../../../../interfaces/api/response';
import { getQuizFileListAPI } from '@/api/quiz/getQuizFileListAPI';
import { getRandomStr } from 'quizzer-lib';

interface AddFileSectionProps {
  fileName: string;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setFileName?: React.Dispatch<React.SetStateAction<string>>;
  setFilelistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const AddFileSection = ({ fileName, setMessage, setFileName, setFilelistoption }: AddFileSectionProps) => {
  const addFile = () => {
    // 設定ステートない場合はreturn(storybook表示用に設定)
    if (!setMessage || !setFilelistoption) {
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    post(
      '/quiz/file',
      {
        file_name: getRandomStr(),
        file_nickname: fileName
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `新規ファイル「${fileName}」を追加しました`,
            messageColor: 'success.light',
            isDisplay: true
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    );
    getQuizFileListAPI(setMessage, setFilelistoption);
  };

  return (
    <>
      <CardHeader subheader="ファイル新規追加" />
      <CardContent className={styles.cardContent}>
        <TextField label="新規ファイル名" setStater={setFileName} className={['flex']} />
        <Button label="追加" variant="contained" attr="after-inline" onClick={(e) => addFile()} />
      </CardContent>
    </>
  );
};
