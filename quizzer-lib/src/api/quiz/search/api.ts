import type { GetQuizApiResponseDto } from '../../../..'
import {
  errorMessage,
  MESSAGES,
  successMessage
} from '../../../..'
import type { SearchQuizAPIRequestDto } from './dto'
import type { ApiResult, ProcessingApiReponse } from '../..'
import { get } from '../..'

interface SearchQuizButtonProps {
  searchQuizRequestData: SearchQuizAPIRequestDto
}

export const searchQuizAPI = async ({
  searchQuizRequestData
}: SearchQuizButtonProps): Promise<ApiResult> => {
  if (searchQuizRequestData.file_num === -1) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  }

  // API送る用に formmat_idは{ [key: string]: boolean }からformat_idカンマ区切りの羅列にする
  const format_id = searchQuizRequestData.format_id
    ? Object.entries(searchQuizRequestData.format_id)
        .filter((x) => x[1])
        .map((x) => x[0])
        .join(',')
    : ''
  // カテゴリ条件はカテゴリ名にカンマが含まれ得るため、配列をJSON文字列化して送る
  const { category_and, category_not, ...rest } =
    searchQuizRequestData
  const categoryParams = Object.entries({
    category_and,
    category_not
  }).reduce(
    (acc, [key, value]) =>
      value && value.length > 0
        ? { ...acc, [key]: JSON.stringify(value) }
        : acc,
    {}
  )

  const result = await get(
    '/quiz/search',
    (data: ProcessingApiReponse) => {
      if (
        (String(data.status)[0] === '2' || String(data.status)[0] === '3') &&
        data.body
      ) {
        const body = data.body as { total: number; quizzes: GetQuizApiResponseDto[] }
        const quizzes = body.quizzes
        return {
          message: successMessage(
            MESSAGES.SUCCESS.MSG00015,
            String(quizzes.length)
          ),
          result: quizzes,
          total: body.total
        }
      } else if (data.status === 404 || data.body) {
        return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else {
        return { isSuccess: false, message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    },
    {
      ...rest,
      ...categoryParams,
      format_id
    }
  )
  return result
}
