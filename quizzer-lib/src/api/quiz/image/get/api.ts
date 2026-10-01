import { ApiResult, authFetch } from '../../..'
import { GetImageOfQuizAPIRequestDto, GetImageOfQuizAPIResponseDto } from '.'
import { errorMessage, MESSAGES, successMessage } from '../../../../..'

interface GetImageOfQuizButtonProps {
  getImageOfQuizRequestData: GetImageOfQuizAPIRequestDto
}

export const getImageOfQuizAPI = async ({
  getImageOfQuizRequestData
}: GetImageOfQuizButtonProps): Promise<ApiResult> => {
  if (!getImageOfQuizRequestData.fileName) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00001) }
  }

  // TODO ここだけは共通APIを使えてないので共通APIを使うようにしたい
  const result = await authFetch(
    (process.env.NEXT_PUBLIC_API_SERVER || '') +
      `/quiz/image?fileName=${getImageOfQuizRequestData.fileName}`,
    {
      method: 'GET'
    }
  )
  if (!result.ok) {
    return { message: errorMessage(MESSAGES.ERROR.MSG00017) }
  }
  const { base64, mimeType } = await result.json()
  const imageUrl = `data:${mimeType};base64,${base64}`

  return {
    message: successMessage(MESSAGES.SUCCESS.MSG00021),
    result: {
      imageUrl
    } as GetImageOfQuizAPIResponseDto
  }
}
