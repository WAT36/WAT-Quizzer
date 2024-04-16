// APIから受け取ったデータを変換しフロント側で処理する型
export interface ProcessingApiReponse {
  status: number
  body: ApiResponse[]
}

export interface ProcessingAddApiReponse {
  status: number
  body: ApiResponse
}

export interface ProcessingApiSingleReponse {
  status: number
  body: ApiResponse
}

// APIから得られるデータ(抽象クラス)
export interface ApiResponse {}
