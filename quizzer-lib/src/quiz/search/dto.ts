export interface SearchQuizAPIRequestDto {
  query: string
  file_num: number
  format_id?: number
  min_rate?: number
  max_rate?: number
  category?: string
  checked?: boolean
  searchInOnlySentense?: boolean
  searchInOnlyAnswer?: boolean
}

//API側で受け取った時のDTO（Pipeで上に変換する）
export interface SearchQuizAPIRequestReceivedDto {
  query: string
  file_num: string
  format_id?: string
  min_rate?: string
  max_rate?: string
  category?: string
  checked?: string
  searchInOnlySentense?: string
  searchInOnlyAnswer?: string
}
