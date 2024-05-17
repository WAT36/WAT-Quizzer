import { del } from '@/api/API';
import { ProcessingAddApiReponse } from 'quizzer-lib';
import { MessageState, WordDetailData, WordMeanData, WordSubSourceData } from '../../../interfaces/state';
import { getWordDetail } from '@/pages/api/english';

interface DeleteEnglishMeanAPIButtonProps {
  word_id: number;
  mean_id: number;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
  setInputEditData?: React.Dispatch<React.SetStateAction<WordMeanData>>;
  setSelectedMeanIndex?: React.Dispatch<React.SetStateAction<number>>;
}

// TODO ここのAPI部分は分けたい
export const deleteEnglishMeanAPI = async ({
  word_id,
  mean_id,
  setMessage,
  setModalIsOpen,
  setWordDetail,
  setInputEditData,
  setSelectedMeanIndex
}: DeleteEnglishMeanAPIButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }

  await del(
    '/english/word/mean',
    {
      meanId: mean_id
    },
    (data: ProcessingAddApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 削除に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        }

        // 更新後の単語データを再取得する
        if (setWordDetail && setMessage) {
          getWordDetail(String(word_id), setMessage, setWordDetail);
        }

        setInputEditData &&
          setInputEditData({
            partsofspeech: {
              id: -1,
              name: ''
            },
            id: -1,
            wordmean_id: -1,
            meaning: ''
          });
        setSelectedMeanIndex && setSelectedMeanIndex(-1);
      } else {
        if (setMessage) {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    if (setMessage) {
      setMessage({
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      });
    }
  });
};
