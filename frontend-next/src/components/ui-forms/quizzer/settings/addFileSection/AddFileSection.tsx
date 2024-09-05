import styles from '../Settings.module.css';
import { CardContent, CardHeader } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import { MessageState } from '../../../../../../interfaces/state';
import { post } from '@/api/API';
import {
  getRandomStr,
  ProcessingApiReponse,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI
} from 'quizzer-lib';

interface AddFileSectionProps {
  fileName: string;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setFileName?: React.Dispatch<React.SetStateAction<string>>;
  setFilelistoption?: React.Dispatch<React.SetStateAction<PullDownOptionDto[]>>;
}

export const AddFileSection = ({ fileName, setMessage, setFileName, setFilelistoption }: AddFileSectionProps) => {
  const addFile = async () => {
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
    // 問題ファイル再取得
    const result = await getQuizFileListAPI();
    setMessage(result.message);
    const pullDownOption = result.result
      ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
      : [];
    setFilelistoption(pullDownOption);
  };

  return (
    <>
      <CardHeader subheader="ファイル新規追加" />
      <CardContent className={styles.cardContent}>
        <TextField label="新規ファイル名" setStater={setFileName} className={['flex']} />
        <Button label="追加" variant="contained" attr="after-inline" onClick={async (e) => await addFile()} />
      </CardContent>
    </>
  );
};
