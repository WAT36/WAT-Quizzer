import { GetQuizAPIRequestDto } from '../get'
// TODO file_num,quiz_num,formatだけを定義した汎用的な型が欲しい
export type DeleteQuizAPIRequestDto = Pick<
  GetQuizAPIRequestDto,
  'file_num' | 'quiz_num' | 'format'
>
