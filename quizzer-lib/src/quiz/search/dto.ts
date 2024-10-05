export interface SearchQuizAPIRequestDto {
  query: string
  file_num: number
  format: string
  min_rate?: number
  max_rate?: number
  category?: string
  checked?: boolean
  searchInOnlySentense?: boolean
  searchInOnlyAnswer?: boolean
}
