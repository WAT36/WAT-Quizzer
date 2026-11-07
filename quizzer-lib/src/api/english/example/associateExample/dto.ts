// 例文紐付け変更APIリクエスト型
export interface ChangeExampleAssociationAPIRequestDto {
  wordName: string
  exampleIdList: number[]
  isAssociation: boolean
}
