import { GetQuizApiResponseDto, ProcessingApiReponse } from '../../..'
import { SearchQuizAPIRequestDto } from './dto'
import { ApiResult, get } from '../../api'

interface SearchQuizButtonProps {
  searchQuizRequestData: SearchQuizAPIRequestDto
}

export const searchQuizAPI = async ({
  searchQuizRequestData
}: SearchQuizButtonProps): Promise<ApiResult> => {
  if (searchQuizRequestData.file_num === -1) {
    return {
      message: {
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await get(
    '/quiz/search',
    (data: ProcessingApiReponse) => {
      if (
        (String(data.status)[0] === '2' || String(data.status)[0] === '3') &&
        data.body?.length > 0
      ) {
        const result: GetQuizApiResponseDto[] = (
          data.body as GetQuizApiResponseDto[]
        ).map((x) => {
          return {
            ...x,
            category: x.quiz_category
              ? x.quiz_category
                  .filter((x) => {
                    return !x.deleted_at
                  })
                  .map((x) => {
                    return x.category
                  })
                  .join(',')
              : ''
          }
        })

        //setSearchResult(res)
        return {
          message: {
            message: 'Success!! ' + result.length + '問の問題を取得しました',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      } else if (data.status === 404 || data.body?.length === 0) {
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
    },
    {
      ...searchQuizRequestData
    }
  )
  return result
}
