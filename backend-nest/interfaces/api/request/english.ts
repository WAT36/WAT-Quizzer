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

export interface EditWordMeanDto {
  wordId: number;
  wordMeanId: number;
  meanId: number;
  partofspeechId: number;
  meaning: string;
}

export interface EditWordSourceDto {
  meanId: number[];
  oldSourceId: number;
  newSourceId: number;
}

export interface AddExampleDto {
  exampleEn: string;
  exampleJa: string;
  meanId: number[];
}

export interface AddWordTestLogDto {
  wordId: number;
}
