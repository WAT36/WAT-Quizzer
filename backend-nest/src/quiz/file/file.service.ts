import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from '../../../config/sql';
import { execQuery, execTransaction } from '../../../lib/db/dao';
import { TransactionQuery } from '../../../interfaces/db';
import {
  AddQuizFileAPIRequestDto,
  DeleteQuizFileAPIRequestDto,
  GetQuizFileApiResponseDto,
} from 'quizzer-lib';

export interface QueryType {
  query: string;
  value: (string | number)[];
}

export type FormatType = 'basic' | 'applied';

@Injectable()
export class QuizFileService {
  // ファイル名リスト取得
  async getFileList() {
    const result: GetQuizFileApiResponseDto[] = await execQuery(
      SQL.QUIZ_FILE.LIST,
      [],
    );
    return result;
  }

  // ファイル追加
  async addFile(req: AddQuizFileAPIRequestDto) {
    try {
      const { file_name, file_nickname } = req;
      // ファイル番号取得
      const max_file_num: number = (await execQuery(SQL.QUIZ_FILE.COUNT, []))[0]
        .file_num;

      // ファイル追加
      return await execQuery(SQL.QUIZ_FILE.ADD, [
        max_file_num + 1,
        file_name,
        file_nickname,
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

  // ファイル削除（とりあえず基礎問題のみ）
  async deleteFile(req: DeleteQuizFileAPIRequestDto) {
    try {
      const { file_id } = req;

      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      // 指定ファイルの問題全削除
      transactionQuery.push({
        query: SQL.QUIZ.DELETE_FILE,
        value: [file_id],
      });

      // 指定ファイルの回答ログ全削除
      transactionQuery.push({
        query: SQL.ANSWER_LOG.FILE.RESET,
        value: [file_id],
      });

      // 指定ファイル削除
      transactionQuery.push({
        query: SQL.QUIZ_FILE.DELETE,
        value: [file_id],
      });

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
}
