import { GetQuizAPIRequestDto } from '../get'

export type FailQuizAPIRequestDto = Required<
  Pick<GetQuizAPIRequestDto, 'file_num' | 'quiz_num' | 'format'>
>
