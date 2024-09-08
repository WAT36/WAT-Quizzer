import {
  PullDownOptionDto,
  GetQuizFileApiResponseDto,
  GetCategoryAPIResponseDto
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
