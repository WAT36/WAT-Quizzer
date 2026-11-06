import type { ApiResult, ProcessingApiReponse } from '../../..'
import { get, onSuccess } from '../../..'
import type { SearchExampleAPIRequestDto, SearchExampleAPIResponseDto } from '.'

// 例文検索
interface SearchExampleAPIProps {
  searchExampleData: SearchExampleAPIRequestDto
}

export const searchExampleAPI = async ({
  searchExampleData
}: SearchExampleAPIProps): Promise<ApiResult> => {
  if (!searchExampleData.query || searchExampleData.query === '') {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:検索語句を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }
  const result = await get(
    '/english/example',
    onSuccess((data: ProcessingApiReponse) => {
      const result: SearchExampleAPIResponseDto[] =
        data.body as SearchExampleAPIResponseDto[]

      if (result.length === 0) {
        return {
          isSuccess: false,
          message: {
            message: 'エラー:条件に合うデータはありません',
            messageColor: 'error',
            isDisplay: true
          }
        }
      }
      return {
        message: {
          message: 'Success!!取得しました',
          messageColor: 'success.light',
          isDisplay: true
        },
        result
      }
    }),
    { ...searchExampleData }
  )
  return result
}
