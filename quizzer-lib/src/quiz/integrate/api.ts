import { ApiResult, post, ProcessingApiReponse } from '../../api'
import { IntegrateToQuizAPIRequestDto } from './dto'

interface IntegrateQuizAPIProps {
  integrateToQuizAPIRequestData: IntegrateToQuizAPIRequestDto
}

export const integrateQuizAPI = async ({
  integrateToQuizAPIRequestData
}: IntegrateQuizAPIProps): Promise<ApiResult> => {
  if (
    !integrateToQuizAPIRequestData.file_num ||
    !integrateToQuizAPIRequestData.fromQuizInfo.quiz_num ||
    !integrateToQuizAPIRequestData.toQuizInfo.quiz_num
  ) {
    return {
      message: {
        message: 'エラー:削除する問題・ファイルを取得して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await post(
    '/quiz/integrate',
    {
      ...integrateToQuizAPIRequestData
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        const quiz_num =
          '[' +
          integrateToQuizAPIRequestData.file_num +
          ':' +
          integrateToQuizAPIRequestData.fromQuizInfo.quiz_num +
          '->' +
          integrateToQuizAPIRequestData.toQuizInfo.quiz_num +
          ']'
        // setQueryOfDeleteQuizState({
        //   fileNum: -1,
        //   quizNum: -1,
        //   format: 'basic'
        // });
        // setQueryOfIntegrateToQuizState({
        //   fileNum: -1,
        //   quizNum: -1,
        //   format: 'basic'
        // });
        // setDeleteQuizInfoState({});
        // setIntegrateToQuizInfoState({});
        return {
          message: {
            message: 'Success! 統合に成功しました' + quiz_num,
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      } else if (data.status === 404) {
        return {
          message: {
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
            isDisplay: true
          }
        }
      } else {
        return {
          message: {
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          }
        }
      }
    }
  )
  return result
}
