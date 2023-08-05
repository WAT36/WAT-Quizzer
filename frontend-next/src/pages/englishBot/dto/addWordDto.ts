export interface meanOfAddWordDto {
  pos: {
    id: number;
    name?: string;
  };
  mean: string | undefined;
}

export interface SendToAddWordApiData {
  partOfSpeechId: number;
  meaning: string;
  partOfSpeechName?: string;
}
