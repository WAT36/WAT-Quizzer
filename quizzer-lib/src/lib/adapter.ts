import { PullDownOptionDto, GetQuizFileApiResponseDto } from '../..'

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
