import { EditQuizAPIRequestDto } from '../quiz/edit/dto'
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
  arr.map((x) => {
    pulldown.push({
      value: x.category,
      label: x.category
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
    dummy1:
      response.quiz_dummy_choice && response.quiz_dummy_choice.length > 0
        ? response.quiz_dummy_choice[0].dummy_choice_sentense
        : '', //四択問題のダミー選択肢１
    dummy2:
      response.quiz_dummy_choice && response.quiz_dummy_choice.length > 1
        ? response.quiz_dummy_choice[1].dummy_choice_sentense
        : '', //四択問題のダミー選択肢２
    dummy3:
      response.quiz_dummy_choice && response.quiz_dummy_choice.length > 2
        ? response.quiz_dummy_choice[2].dummy_choice_sentense
        : '', //四択問題のダミー選択肢３
    explanation: response.quiz_explanation?.explanation // 解説
  }
  return result
}
