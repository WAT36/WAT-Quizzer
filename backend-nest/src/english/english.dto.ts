export interface EnglishWordDataDto {
  partOfSpeechId: number;
  sourceId: number;
  meaning: string;
  partOfSpeechName?: string;
  sourceName?: string;
}

export interface AddEnglishWordDto {
  wordName: string;
  pronounce: string;
  meanArrayData: EnglishWordDataDto[];
}
