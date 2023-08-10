import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      const data = await execQuery(SQL.ENGLISH.PARTOFSPEECH.GET.ALL, []);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 出典取得
  async getSourceService() {
    try {
      const data = await execQuery(SQL.ENGLISH.SOURCE.GET.ALL, []);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
        // その他　の場合は入力した品詞をチェック
        let partofspeechId: number = meanArrayData[i].partOfSpeechId;
        if (meanArrayData[i].partOfSpeechId === -2) {
          if (!meanArrayData[i].partOfSpeechName) {
            throw new Error(`[${i + 1}]品詞が入力されていません`);
          }

          // 品詞名で既に登録されているか検索
          const posData = await execQuery(SQL.ENGLISH.PARTOFSPEECH.GET.BYNAME, [
            meanArrayData[i].partOfSpeechName,
          ]);

          if (posData[0]) {
            // 既にある -> そのIDを品詞IDとして使用
            partofspeechId = posData[0].id;
          } else {
            // 登録されていない -> 新規登録してそのIDを使用
            const result = await execQuery(SQL.ENGLISH.PARTOFSPEECH.ADD, [
              meanArrayData[i].partOfSpeechName,
            ]);
            partofspeechId = result['insertId'];
          }
        }

        // その他　の場合は入力した出典をチェック
        let sourceId: number = meanArrayData[i].sourceId;
        if (meanArrayData[i].sourceId === -2) {
          if (!meanArrayData[i].sourceName) {
            throw new Error(`[${i + 1}]出典が入力されていません`);
          }

          // 出典名で既に登録されているか検索
          const sourceData = await execQuery(SQL.ENGLISH.SOURCE.GET.BYNAME, [
            meanArrayData[i].sourceName,
          ]);

          if (sourceData[0]) {
            // 既にある -> そのIDを出典IDとして使用
            sourceId = sourceData[0].id;
          } else {
            // 登録されていない -> 新規登録してそのIDを使用
            const result = await execQuery(SQL.ENGLISH.SOURCE.ADD, [
              meanArrayData[i].sourceName,
            ]);
            sourceId = result['insertId'];
          }
        }

        const meanResult: any = await execQuery(SQL.ENGLISH.MEAN.ADD, [
          wordData.insertId,
          i + 1,
          partofspeechId,
          meanArrayData[i].meaning,
        ]);
        await execQuery(SQL.ENGLISH.MEAN.SOURCE, [
          meanResult.insertId,
          sourceId,
        ]);
      }
      return { wordData };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語検索
  async searchWordService(wordName: string) {
    try {
      const wordData = await execQuery(SQL.ENGLISH.WORD.SEARCH, [
        '%' + (wordName || '') + '%',
      ]);
      return { wordData };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
