export interface EnglishWordDataDto {
  partOfSpeechId: number;
  meaning: string;
  partOfSpeechName?: string;
}

export interface AddEnglishWordDto {
  wordName: string;
  pronounce: string;
  meanArrayData: EnglishWordDataDto[];
}
