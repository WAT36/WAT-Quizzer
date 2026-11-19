import type { ApiResponse } from '../../..'

// 画像候補の検索APIのリクエスト（クエリで送るため、スキーマの入力型ではなく画面で扱う型を定義する）
export interface SearchImageCandidatesOfQuizAPIRequestDto {
  quiz_id: number // 問題のID(quiz.id)
  hint?: string // 検索の追加指示
}

// Webで見つかった画像の候補
export interface QuizImageCandidate {
  image_url: string // 元画像のURL
  thumbnail_url: string | null // サムネイルのURL（元画像を取得できない時の代わりにも使う）
  source_url: string | null // 画像が載っていたページのURL
  caption: string | null // 画像の短い説明
  // 候補を返したのがこのシステムであることの署名（登録APIで検証し、任意のURLを取得させないため）
  signature: string
}

export interface SearchImageCandidatesOfQuizAPIResponseDto extends ApiResponse {
  candidates: QuizImageCandidate[]
}
