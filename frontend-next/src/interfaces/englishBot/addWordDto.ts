export interface meanOfAddWordDto {
  pos: {
    id: number;
    name?: string;
  };
  source: {
    id: number;
    name?: string;
  };
  mean: string | undefined;
}

export interface SendToAddWordApiData {
  partOfSpeechId: number;
  sourceId: number;
  meaning: string;
  partOfSpeechName?: string;
  sourceName?: string;
}
