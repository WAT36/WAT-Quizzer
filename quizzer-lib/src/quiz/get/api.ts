import { GetQuizAPIRequestDto, GetQuizApiResponseDto } from '.'
import { ProcessingApiSingleReponse } from '../../..'
import { ApiResult, get } from '../../api'

interface GetQuizAPIProps {
  getQuizRequestData: GetQuizAPIRequestDto
}

export const getQuizAPI = async ({
  getQuizRequestData
}: GetQuizAPIProps): Promise<ApiResult> => {
  if (getQuizRequestData.fileNum === '') {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  } else if (!getQuizRequestData.quizNum || getQuizRequestData.quizNum === '') {
    return {
      message: {
        message: 'エラー:問題番号を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await get(
    '/quiz',
    (data: ProcessingApiSingleReponse) => {
      if (data.status === 404) {
        return {
          message: {
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error',
            isDisplay: true
          }
        }
      } else if (data.status === 200) {
        const result: GetQuizApiResponseDto = data.body as GetQuizApiResponseDto
        // if (setDisplayQuizStater) {
        //   setDisplayQuizStater({
        //     fileNum: res.file_num,
        //     quizNum: res.quiz_num,
        //     checked: res.checked || false,
        //     expanded: false,
        //     ...generateQuizSentense(queryOfQuizState.format, res)
        //   });
        // }
        // if (setQueryofPutQuiz) {
        //   setQueryofPutQuiz((prev) => ({
        //     format: prev.format,
        //     formatValue: prev.formatValue,
        //     fileNum: res.file_num,
        //     quizNum: res.quiz_num,
        //     question: res.quiz_sentense,
        //     answer: res.answer,
        //     quiz_category: res.quiz_category
        //       ?.map((x) => {
        //         return x.category;
        //       })
        //       .join(','),
        //     img_file: res.img_file,
        //     matched_basic_quiz_id:
        //       res.quiz_basis_advanced_linkage && res.quiz_basis_advanced_linkage.length > 0
        //         ? JSON.stringify(
        //             res.quiz_basis_advanced_linkage.map((x) => {
        //               return x.basis_quiz_id;
        //             })
        //           )
        //             .slice(1)
        //             .slice(0, -1)
        //         : '',
        //     dummy1: res.dummy_choice && res.dummy_choice[0].dummy_choice_sentense, //四択問題のダミー選択肢１
        //     dummy2: res.dummy_choice && res.dummy_choice[1].dummy_choice_sentense, //四択問題のダミー選択肢２
        //     dummy3: res.dummy_choice && res.dummy_choice[2].dummy_choice_sentense, //四択問題のダミー選択肢３
        //     explanation: res.advanced_quiz_explanation?.explanation
        //   }));
        // }
        return {
          message: {
            message: '問題を取得しました',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
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
    },
    { ...getQuizRequestData }
  )
  return result
}
