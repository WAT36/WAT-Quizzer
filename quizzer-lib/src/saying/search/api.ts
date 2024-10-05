import { SearchSayingAPIRequestDto, SearchSayingAPIResponseDto } from './dto'
import { ApiResult, get, ProcessingApiReponse } from '../../api'
import { defaultMessage, errorMessage, MESSAGES } from '../../..'

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
        return {
          message: defaultMessage(MESSAGES.DEFAULT.MSG00001),
          result
        }
      } else if (
        data.status === 404 ||
        (Array.isArray(data.body) && data.body?.length === 0)
      ) {
        return { message: errorMessage(MESSAGES.ERROR.MSG00003) }
      } else {
        return { message: errorMessage(MESSAGES.ERROR.MSG00004) }
      }
    },
    {
      ...searchSayingRequestData
    }
  )
  return result
}
