import type { LinkWordEtymologyAPIRequestDto } from '.'
import type { ApiResult } from '../../../..'
import { post, onSuccess, validateRequest } from '../../../..'
import { linkWordEtymologyAPIRequestSchema } from './schema'

interface LinkWordEtymologyAPIProps {
  linkWordEtymologyData: LinkWordEtymologyAPIRequestDto
}

export const linkWordEtymologyAPI = async ({
  linkWordEtymologyData
}: LinkWordEtymologyAPIProps): Promise<ApiResult> => {
  const invalid = validateRequest(linkWordEtymologyAPIRequestSchema, linkWordEtymologyData)
  if (invalid) return invalid

  const result = await post(
    '/english/word/etymology/link',
    linkWordEtymologyData,
    onSuccess(() => {
      return {
        message: {
          message: 'Success!!追加に成功しました',
          messageColor: 'success.light',
          isDisplay: true
        }
      }
    })
  ).catch(() => {
    return {
      isSuccess: false,
      message: {
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      }
    }
  })
  return result
}
