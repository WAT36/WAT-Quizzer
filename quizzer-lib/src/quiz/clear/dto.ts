import { GetQuizAPIRequestDto } from '../get'

export type ClearQuizAPIRequestDto = Required<
  Pick<GetQuizAPIRequestDto, 'file_num' | 'quiz_num' | 'format'>
>
