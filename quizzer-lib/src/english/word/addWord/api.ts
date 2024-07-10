import { post } from '../../../api/API'
import { AddWordAPIRequestDto } from './dto'
import { Message } from '../../../common'
import { ProcessingApiReponse } from '../../../interfaces'

interface AddWordButtonProps {
  addWordData: AddWordAPIRequestDto
}

// 登録ボタン押下後。単語と意味をDBに登録
export const addWordAPI = async ({ addWordData }: AddWordButtonProps) => {
  if (addWordData.inputWord.wordName === '') {
    return {
      message: 'エラー:単語が入力されておりません',
      messageColor: 'error',
      isDisplay: true
    } as Message
  }
  for (let i = 0; i < addWordData.meanArrayData.length; i++) {
    if (
      addWordData.meanArrayData[i].partOfSpeechId === -1 ||
      (addWordData.meanArrayData[i].partOfSpeechId === -2 &&
        !addWordData.meanArrayData[i].partOfSpeechName)
    ) {
      return {
        message: `エラー:${i + 1}行目の品詞を入力してください`,
        messageColor: 'error',
        isDisplay: true
      } as Message
    } else if (
      !addWordData.meanArrayData[i].meaning ||
      addWordData.meanArrayData[i].meaning === ''
    ) {
      return {
        message: `エラー:${i + 1}行目の意味を入力してください`,
        messageColor: 'error',
        isDisplay: true
      } as Message
    }
  }

  const result = await post(
    '/english/word',
    addWordData,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        return {
          message: `単語「${addWordData.inputWord.wordName}」を登録しました`,
          messageColor: 'success.light',
          isDisplay: true
        } as Message
      } else {
        return {
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        } as Message
      }
    }
  ).catch((err: Error) => {
    return {
      message: err.message,
      messageColor: 'error',
      isDisplay: true
    } as Message
  })
  return result
}
