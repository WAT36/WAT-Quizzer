import { GetQuizAPIRequestDto } from '../get'

export type FailQuizAPIRequestDto = Required<
  Pick<GetQuizAPIRequestDto, 'fileNum' | 'quizNum' | 'format'>
>
