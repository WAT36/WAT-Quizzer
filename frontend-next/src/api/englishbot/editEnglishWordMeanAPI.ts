import { patch } from '@/api/API';
import { getWordDetailAPI, GetWordDetailAPIResponseDto, ProcessingAddApiReponse } from 'quizzer-lib';
import { WordMeanData, MessageState, WordDetailData } from '../../../interfaces/state';

interface EditEnglishWordMeanButtonProps {
  wordDetail: WordDetailData;
  inputEditData: WordMeanData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setInputEditData?: React.Dispatch<React.SetStateAction<WordMeanData>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
}

// TODO ここのAPI部分は分けたい
export const editEnglishWordMeanAPI = async ({
  wordDetail,
  inputEditData,
  setMessage,
  setModalIsOpen,
  setInputEditData,
  setWordDetail
}: EditEnglishWordMeanButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (inputEditData.partsofspeech.id === -1) {
    if (setMessage) {
      setMessage({ message: 'エラー:品詞を選択して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  await patch(
    '/english/word/' + String(wordDetail.id),
    {
      wordId: wordDetail.id,
      wordMeanId: inputEditData.wordmean_id,
      meanId: inputEditData.id,
      partofspeechId: inputEditData.partsofspeech.id,
      meaning: inputEditData.meaning
    },
    async (data: ProcessingAddApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 編集に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        }

        // 更新確認後、単語の意味を再取得させる
        if (setWordDetail) {
          const result = (await getWordDetailAPI({ id: String(wordDetail.id) })).result as GetWordDetailAPIResponseDto;
          setWordDetail(result);
        }
      } else {
        if (setMessage) {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
        }
      }

      if (setInputEditData) {
        setInputEditData({
          partsofspeech: {
            id: -1,
            name: ''
          },
          id: -1,
          wordmean_id: -1,
          meaning: ''
        });
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
