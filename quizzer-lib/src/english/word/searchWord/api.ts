import { get, ApiResult, ProcessingApiReponse } from '../../../api'
import { SearchWordAPIRequestDto, SearchWordAPIResponseDto } from './dto'

interface SearchWordAPIProps {
  searchWordData: SearchWordAPIRequestDto
}

export const searchWordAPI = async ({
  searchWordData
}: SearchWordAPIProps): Promise<ApiResult> => {
  if (!searchWordData.wordName || searchWordData.wordName === '') {
    return {
      message: {
        message: 'エラー:検索語句を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }

  const result = await get(
    '/english/word/search',
    (data: ProcessingApiReponse) => {
      if (
        data.status === 200 &&
        Array.isArray(data.body) &&
        data.body?.length > 0
      ) {
        const result: SearchWordAPIResponseDto[] =
          data.body as SearchWordAPIResponseDto[]
        return {
          message: {
            message: 'Success!!' + result.length + '問の問題を取得しました',
            messageColor: 'success.light',
            isDisplay: true
          },
          result
        }
      } else if (
        data.status === 404 ||
        (Array.isArray(data.body) && data.body?.length === 0)
      ) {
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
    { ...searchWordData }
  )
  return result
}
