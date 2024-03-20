// 啓発本登録APIリクエスト型
export interface AddBookAPIRequestDto {
  book_name: string
}

// 格言追加APIリクエスト型
export interface AddSayingAPIRequestDto {
  book_id: number
  saying: string
  explanation: string
}
