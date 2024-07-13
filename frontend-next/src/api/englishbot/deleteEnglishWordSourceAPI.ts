import { del } from '@/api/API';
import { getWordDetailAPI, GetWordDetailAPIResponseDto, ProcessingAddApiReponse } from 'quizzer-lib';
import { MessageState, WordDetailData, WordSubSourceData } from '../../../interfaces/state';

interface AddEnglishWordSubSourceButtonProps {
  word_id: number;
  source_id: number;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
  setSelectedWordSourceIndex?: React.Dispatch<React.SetStateAction<number>>;
}

// TODO ここのAPI部分は分けたい
export const deleteEnglishWordSourceAPI = async ({
  word_id,
  source_id,
  setMessage,
  setModalIsOpen,
  setWordDetail,
  setSelectedWordSourceIndex
}: AddEnglishWordSubSourceButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }

  await del(
    '/english/word/source',
    {
      word_id,
      source_id
    },
    async (data: ProcessingAddApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        if (setMessage) {
          setMessage({
            message: 'Success!! 削除に成功しました',
            messageColor: 'success.light',
            isDisplay: true
          });
        }

        // 更新後の単語データを再取得する
        if (setWordDetail) {
          const result = (await getWordDetailAPI({ id: String(word_id) })).result as GetWordDetailAPIResponseDto;
          setWordDetail(result);
        }

        setSelectedWordSourceIndex && setSelectedWordSourceIndex(-1);
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
