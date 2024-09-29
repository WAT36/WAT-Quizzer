export interface SearchQuizAPIRequestDto {
  query: string
  file_num: number
  format: string
  min_rate?: number
  max_rate?: number
  category?: string
  checked?: string // TODO booleanにしたい
  searchInOnlySentense?: string // booleanにしたい
  searchInOnlyAnswer?: string // booleanにしたい
}
