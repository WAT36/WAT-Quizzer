import { GetQuizAPIRequestDto } from '../get'

export type ClearQuizAPIRequestDto = Required<
  Pick<GetQuizAPIRequestDto, 'fileNum' | 'quizNum' | 'format'>
>
