import { get } from '@/api/API';
import {
  EnglishWordByIdApiResponse,
  EnglishWordSourceByIdApiResponse,
  EnglishWordSubSourceByIdApiResponse,
  ProcessingApiReponse
} from 'quizzer-lib';
import { MessageState, WordMeanData, WordSourceData, WordSubSourceData } from '../../../interfaces/state';

export const getWordDetail = async (
  id: string,
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setWordName: React.Dispatch<React.SetStateAction<string>>,
  setMeanData: React.Dispatch<React.SetStateAction<WordMeanData[]>>
) => {
  get(
    '/english/word/' + id,
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: EnglishWordByIdApiResponse[] = data.body as EnglishWordByIdApiResponse[];
        const wordmeans: WordMeanData[] = result.map((x: EnglishWordByIdApiResponse) => {
          return {
            wordId: +x.word_id,
            wordName: x.name,
            wordmeanId: x.wordmean_id,
            meanId: x.mean_id,
            mean: x.meaning,
            partofspeechId: x.partsofspeech_id,
            partofspeechName: x.partsofspeech
          };
        });
        setWordName(result[0].name || '(null)');
        setMeanData(wordmeans);
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    },
    {}
  );
};

export const getWordSource = async (
  id: string,
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setWordSourceData: React.Dispatch<React.SetStateAction<WordSourceData[]>>
) => {
  get(
    '/english/word/source/' + id,
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: EnglishWordSourceByIdApiResponse[] = data.body as EnglishWordSourceByIdApiResponse[];
        const wordsources: WordSourceData[] = result.map((x: EnglishWordSourceByIdApiResponse) => {
          return {
            wordId: x.word_id,
            wordName: x.word_name,
            sourceId: x.source_id,
            sourceName: x.source_name
          };
        });
        setWordSourceData(wordsources);
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    },
    {}
  );
};

export const getWordSubSource = async (
  id: string,
  setMessageStater: React.Dispatch<React.SetStateAction<MessageState>>,
  setWordSubSourceData: React.Dispatch<React.SetStateAction<WordSubSourceData[]>>
) => {
  get(
    '/english/word/subsource/' + id,
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: EnglishWordSubSourceByIdApiResponse[] = data.body as EnglishWordSubSourceByIdApiResponse[];
        const wordsubsources: WordSubSourceData[] = result.map((x: EnglishWordSubSourceByIdApiResponse) => {
          return {
            subSourceName: x.subsource
          };
        });
        setWordSubSourceData(wordsubsources);
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    },
    {}
  );
};
