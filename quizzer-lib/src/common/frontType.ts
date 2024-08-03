// TODO このファイルはinterfaceフォルダとか作ってそこに入れたい。commonじゃなくて

import { PartofSpeechApiResponse, SourceApiResponse } from '../..'

//  プルダウン選択肢用
export interface PullDownOptionDto {
  value: string
  label: string
}

// 品詞出典APIレスポンスをプルダウン型に変える
// TODO ここじゃなくてどこか別の所におきたい
export const apiResponsePullDownAdapter = (
  response: PartofSpeechApiResponse[] | SourceApiResponse[]
) => {
  let posList: PullDownOptionDto[] = []
  for (var i = 0; i < response.length; i++) {
    posList.push({
      value: String(response[i].id),
      label: response[i].name
    })
  }
  return posList
}
