import { Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery } from 'lib/db/dao';
import { AddEnglishWordDto } from './english.dto';

@Injectable()
export class EnglishService {
  getHello(): string {
    return 'Hello World!';
  }

  // 品詞取得
  async getPartsofSpeechService() {
    try {
      const data = await execQuery(SQL.ENGLISH.PARTOFSPEECH, []);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // 単語と意味追加
  async addWordAndMeanService(req: AddEnglishWordDto) {
    const { wordName, pronounce, meanArrayData } = req;
    try {
      const wordData: any = await execQuery(SQL.ENGLISH.WORD.ADD, [
        wordName,
        pronounce,
      ]);

      for (let i = 0; i < meanArrayData.length; i++) {
        await execQuery(SQL.ENGLISH.MEAN.ADD, [
          wordData.insertId,
          i + 1,
          meanArrayData[i].partOfSpeechId,
          meanArrayData[i].meaning,
        ]);
      }
      return { wordData };
    } catch (error) {
      throw error;
    }
  }

  // 単語検索
  async searchWordService(wordName: string) {
    try {
      const wordData = await execQuery(SQL.ENGLISH.WORD.SEARCH, [
        '%' + (wordName || '') + '%',
      ]);
      return { wordData };
    } catch (error) {
      throw error;
    }
  }
}
