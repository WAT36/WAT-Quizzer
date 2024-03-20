// 格言取得APIレスポンス型
export interface GetSayingAPIResponseDto {
  id?: number
  saying: string
  explanation: string
  name?: string
}

// 啓発本取得APIレスポンス型
export interface GetBookAPIResponseDto {
  id: number
  name: string
}
