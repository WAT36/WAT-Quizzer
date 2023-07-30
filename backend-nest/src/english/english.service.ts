import { Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery } from 'lib/db/dao';

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
}
