import { GetQuizAPIRequestDto } from '../../../..'

export type GetImageOfQuizAPIRequestDto = Required<
  Pick<GetQuizAPIRequestDto, 'file_num' | 'quiz_num' | 'format'>
>
