import { del } from '@/api/API';
import { getWordDetailAPI, GetWordDetailAPIResponseDto, ProcessingAddApiReponse } from 'quizzer-lib';
import { MessageState, WordDetailData, WordSubSourceData } from '../../../interfaces/state';

interface AddEnglishWordSubSourceButtonProps {
  wordDetail: WordDetailData;
  subSourceData: WordSubSourceData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubSourceData?: React.Dispatch<React.SetStateAction<WordSubSourceData>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
}

// TODO ここのAPI部分は分けたい
export const deleteEnglishWordSubSourceAPI = async ({
  wordDetail,
  subSourceData,
  setMessage,
  setModalIsOpen,
  setSubSourceData,
  setWordDetail
}: AddEnglishWordSubSourceButtonProps) => {
  if (setModalIsOpen) {
    setModalIsOpen(false);
  }
  if (!subSourceData.subsource || subSourceData.subsource === '') {
    if (setMessage) {
      setMessage({ message: 'エラー:サブ出典を入力して下さい', messageColor: 'error', isDisplay: true });
    }
    return;
  }

  await del(
    '/english/word/subsource',
    {
      id: subSourceData.id
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
          const result = (await getWordDetailAPI({ id: String(wordDetail.id) })).result as GetWordDetailAPIResponseDto;
          setWordDetail(result);
        }

        setSubSourceData &&
          setSubSourceData({
            id: -1,
            subsource: '',
            created_at: ''
          });
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
