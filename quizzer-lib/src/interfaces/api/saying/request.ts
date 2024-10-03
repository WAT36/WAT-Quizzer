// 格言追加APIリクエスト型
export interface AddSayingAPIRequestDto {
  book_id: number
  saying: string
  explanation: string
}

//格言編集APIリクエスト型
export interface EditSayingAPIRequestDto {
  id: number
  saying: string
  explanation?: string
}
