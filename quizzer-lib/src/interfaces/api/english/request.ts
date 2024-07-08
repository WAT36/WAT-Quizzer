// 例文追加APIリクエスト型
export interface AddExampleAPIRequestDto {
  exampleEn: string
  exampleJa: string
  wordName: string
}

//
export interface ChangeAssociationOfExampleRequestDto {
  wordName: string
  checkedId: number
  isAssociation: boolean
}
