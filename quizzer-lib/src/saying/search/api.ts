import { SearchSayingAPIRequestDto, SearchSayingAPIResponseDto } from './dto'
import { ApiResult, get, ProcessingApiReponse } from '../../api'

interface searchSayingAPIProps {
  searchSayingRequestData: SearchSayingAPIRequestDto
}

export const searchSayingAPI = async ({
  searchSayingRequestData
}: searchSayingAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/saying/search',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && Array.isArray(data.body)) {
        const result: SearchSayingAPIResponseDto[] =
          data.body as SearchSayingAPIResponseDto[]
        // setSearchResult(
        //   res.map((x) => {
        //     return {
        //       id: x.id,
        //       explanation: x.explanation,
        //       saying: x.saying,
        //       name: x.selfhelp_book.name
        //     };
        //   })
        // );
        return {
          message: {
            message: '　',
            messageColor: 'success.light',
            isDisplay: false
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
    {
      ...searchSayingRequestData
    }
  )
  return result
}
