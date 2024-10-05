import { get, ProcessingApiReponse } from '../../../api'
import { SearchExampleAPIRequestDto, SearchExampleAPIResponseDto } from '.'

// 例文検索
interface SearchExampleAPIProps {
  searchExampleData: SearchExampleAPIRequestDto
}

export const searchExampleAPI = async ({
  searchExampleData
}: SearchExampleAPIProps) => {
  if (!searchExampleData.query || searchExampleData.query === '') {
    return {
      message: {
        message: 'エラー:検索語句を入力して下さい',
        messageColor: 'error',
        isDisplay: true
      }
    }
  }
  const result = await get(
    '/english/example',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: SearchExampleAPIResponseDto[] =
          data.body as SearchExampleAPIResponseDto[]

        if (result.length === 0) {
          return {
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
    { ...searchExampleData }
  )
  return result
}
