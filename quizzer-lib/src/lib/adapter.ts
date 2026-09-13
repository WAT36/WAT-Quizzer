import { EditQuizAPIRequestDto } from '../api/quiz/edit/dto'
import {
  PullDownOptionDto,
  GetQuizFileApiResponseDto,
  GetCategoryAPIResponseDto,
  GetQuizApiResponseDto
} from '../..'

// 問題ファイルリスト取得API -> フロント用 問題ファイルプルダウン用DTO に変える
export const quizFileListAPIResponseToPullDownAdapter = (
  arr: GetQuizFileApiResponseDto[]
) => {
  const pulldown: PullDownOptionDto[] = []
  arr.map((x) => {
    pulldown.push({
      value: String(x.file_num),
      label: x.file_nickname
    })
  })
  return pulldown
}

// 問題カテゴリリスト取得API -> フロント用 カテゴリプルダウン用DTO に変える
export const getCategoryListAPIResponseToPullDownAdapter = (
  arr: GetCategoryAPIResponseDto[]
) => {
  const pulldown: PullDownOptionDto[] = []
  const uniqueCategoryList = Array.from(
    new Set(
      arr.map((x) => x.category).filter((category) => category && category.trim() !== '')
    )
  )
  uniqueCategoryList.map((x) => {
    pulldown.push({
      value: x,
      label: x
    })
  })
  return pulldown
}

// 問題取得APIレスポンス -> 問題編集APIリクエスト
export const getQuizAPIResponseToEditQuizAPIRequestAdapter = (
  response: GetQuizApiResponseDto
) => {
  const result: EditQuizAPIRequestDto = {
    quiz_id: response.id,
    file_num: response.file_num,
    quiz_num: response.quiz_num,
    format_id: response.format_id,
    question: response.quiz_sentense,
    answer: response.answer,
    category: response.quiz_category
      ? response.quiz_category
          .map((c) => {
            return c.category
          })
          .join(',')
      : '',
    img_file: response.img_file,
    matched_basic_quiz_id: response.quiz_advanced_linkage
      ? response.quiz_advanced_linkage
          .map((id) => {
            return String(id.basis_quiz_id)
          })
          .join(',')
      : '',
    dummyChoice:
      response.quiz_dummy_choice &&
      response.quiz_dummy_choice.map((x) => {
        return {
          sentense: x.dummy_choice_sentense,
          isCorrect: x.is_corrected
        }
      }),
    explanation: response.quiz_explanation?.explanation // 解説
  }
  return result
}
