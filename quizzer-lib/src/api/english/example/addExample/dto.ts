// 例文追加APIリクエスト型
export interface AddExampleAPIRequestDto {
  exampleEn: string
  exampleJa: string
  explanation?: string
  wordName?: string
  sourceId?: number
  newSourceName?: string // 出典がその他の場合必要
}
