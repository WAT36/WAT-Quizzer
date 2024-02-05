import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery, execTransaction } from 'lib/db/dao';
import {
  AddEnglishWordDto,
  AddExampleDto,
  AddWordSubSourceDto,
  AddWordTestLogDto,
  EditWordMeanDto,
  EditWordSourceDto,
} from '../../interfaces/api/request/english';
import { TransactionQuery } from '../../interfaces/db';

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
      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];
      //単語追加
      transactionQuery.push({
        query: SQL.ENGLISH.WORD.ADD,
        value: [wordName, pronounce],
      });

      // insertされるだろう単語ID,意味ID計算
      const wordWillId =
        ((await execQuery(SQL.ENGLISH.WORD.GET.MAX_ID, []))[0][
          'id'
        ] as number) + 1;
      const meanWillId =
        ((await execQuery(SQL.ENGLISH.MEAN.GET.MAX_ID, []))[0][
          'id'
        ] as number) + 1;

      //入力した意味一つ分のデータ作成
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

        transactionQuery.push({
          query: SQL.ENGLISH.MEAN.ADD,
          value: [wordWillId, i + 1, partofspeechId, meanArrayData[i].meaning],
        });
        transactionQuery.push({
          query: SQL.ENGLISH.MEAN.SOURCE.ADD,
          value: [meanWillId + i, sourceId],
        });
      }

      //トランザクション実行
      const result = await execTransaction(transactionQuery);
      return { result };
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
      return await execQuery(SQL.ENGLISH.WORD.SEARCH, [
        '%' + (wordName || '') + '%',
      ]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語全取得
  async getAllWordService() {
    try {
      return await execQuery(SQL.ENGLISH.WORD.GET.ALL, []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語IDから出典情報取得
  async getSourceOfWordById(id: number) {
    try {
      return await execQuery(SQL.ENGLISH.WORD.GET.SOURCE, [id]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // IDから単語情報取得
  async getWordByIdService(id: number) {
    try {
      return await execQuery(SQL.ENGLISH.WORD.GET.ID, [id]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語名から単語情報取得
  async getWordByNameService(name: string) {
    try {
      return await execQuery(SQL.ENGLISH.WORD.GET.NAME, [name]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語の意味などを更新
  async editWordMeanService(req: EditWordMeanDto) {
    try {
      const { wordId, wordMeanId, meanId, partofspeechId, meaning } = req;
      //意味編集及び追加
      if (meanId === -1) {
        return await execQuery(SQL.ENGLISH.MEAN.ADD, [
          wordId,
          wordMeanId,
          partofspeechId,
          meaning,
        ]);
      } else {
        return await execQuery(SQL.ENGLISH.MEAN.EDIT, [
          partofspeechId,
          meaning,
          wordId,
          wordMeanId,
        ]);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 例文追加
  async addExampleService(req: AddExampleDto) {
    const { exampleEn, exampleJa, meanId } = req;
    try {
      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      // insertされるだろう例文ID計算
      const exampleWillId =
        ((await execQuery(SQL.ENGLISH.EXAMPLE.GET.MAX_ID, []))[0][
          'id'
        ] as number) + 1;

      //例文追加
      transactionQuery.push({
        query: SQL.ENGLISH.EXAMPLE.ADD,
        value: [exampleEn, exampleJa],
      });
      for (let i = 0; i < meanId.length; i++) {
        // await execQuery(SQL.ENGLISH.MEAN.EXAMPLE.ADD, [exampleId, meanId[i]]);
        transactionQuery.push({
          query: SQL.ENGLISH.MEAN.EXAMPLE.ADD,
          value: [exampleWillId, meanId[i]],
        });
      }
      //トランザクション実行
      return await execTransaction(transactionQuery);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語をランダムに取得
  async getRandomWordService(sourceId: number) {
    try {
      const sourceIdSql = !sourceId
        ? ''
        : `
      LEFT OUTER JOIN
        mean_source ms 
      ON
        m.id = ms.mean_id 
      WHERE ms.source_id = ${sourceId}
      `;
      // ランダムに英単語id,nameを返す
      return await execQuery(SQL.ENGLISH.WORD.GET.RANDOM(sourceIdSql), []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 指定した単語を出題するときの四択選択肢（正解選択肢1つとダミー選択肢3つ）を作る
  async makeFourChoiceService(wordId: number) {
    try {
      if (isNaN(wordId)) {
        throw new HttpException(
          `単語IDが不正です:${wordId}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      // 指定単語idの意味を取得
      const correctMeans = await execQuery(SQL.ENGLISH.MEAN.GET.BY_WORD_ID, [
        wordId,
      ]);
      // ダミー選択肢用の意味を取得
      const dummyMeans = await execQuery(SQL.ENGLISH.MEAN.GET.BY_NOT_WORD_ID, [
        wordId,
      ]);

      return [
        {
          correct: { mean: correctMeans[0].meaning },
          dummy: dummyMeans.map((x) => ({
            mean: x.meaning,
          })),
        },
      ];
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 正解登録
  async wordTestClearedService(req: AddWordTestLogDto) {
    try {
      const { wordId } = req;
      return await execQuery(SQL.ENGLISH.WORD_TEST.CLEARED.INPUT, [wordId]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 不正解登録
  async wordTestFailedService(req: AddWordTestLogDto) {
    try {
      const { wordId } = req;
      return await execQuery(SQL.ENGLISH.WORD_TEST.FAILED.INPUT, [wordId]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語の出典追加・更新
  async editSourceOfWordById(req: EditWordSourceDto) {
    try {
      const { meanId, oldSourceId, newSourceId } = req;
      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      if (oldSourceId === -1) {
        // 出典追加
        for (let i = 0; i < meanId.length; i++) {
          transactionQuery.push({
            query: SQL.ENGLISH.MEAN.SOURCE.ADD,
            value: [meanId[i], newSourceId],
          });
        }
      } else {
        // 出典更新
        for (let i = 0; i < meanId.length; i++) {
          transactionQuery.push({
            query: SQL.ENGLISH.MEAN.SOURCE.EDIT,
            value: [newSourceId, meanId[i], oldSourceId],
          });
        }
      }
      //トランザクション実行
      return await execTransaction(transactionQuery);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 単語のサブ出典追加・更新
  async addSubSourceOfWordById(req: AddWordSubSourceDto) {
    try {
      const { wordId, subSource } = req;
      return await execQuery(SQL.ENGLISH.WORD.SUBSOURCE.ADD, [
        wordId,
        subSource,
      ]);
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
