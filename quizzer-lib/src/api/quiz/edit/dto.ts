import type { z } from 'zod'
import type { QuizApiResponseDto } from '../dto'
import type { editQuizAPIRequestSchema } from './schema'

export type EditQuizAPIRequestDto = z.infer<typeof editQuizAPIRequestSchema>

// 問題編集APIのレスポンス（更新後の問題）
export type EditQuizApiResponseDto = QuizApiResponseDto
