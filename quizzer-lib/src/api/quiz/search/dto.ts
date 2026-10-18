export interface SearchQuizAPIRequestDto {
  query: string
  file_num: number
  format_id?: { [key: string]: boolean }
  min_rate?: number
  max_rate?: number
  category_and?: string[]
  category_not?: string[]
  checked?: boolean
  searchInOnlySentense?: boolean
  searchInOnlyAnswer?: boolean
  searchInExplanation?: boolean
  onlyDirectCategory?: boolean
  result_from?: number
  result_to?: number
}

//API側で受け取った時のDTO（Pipeで上に変換する）
export interface SearchQuizAPIRequestReceivedDto {
  query: string
  file_num: string
  format_id?: string
  min_rate?: string
  max_rate?: string
  // カテゴリ条件はJSON文字列化した配列で受け取る
  category_and?: string
  category_not?: string
  checked?: string
  searchInOnlySentense?: string
  searchInOnlyAnswer?: string
  searchInExplanation?: string
  onlyDirectCategory?: string
  result_from?: string
  result_to?: string
}
