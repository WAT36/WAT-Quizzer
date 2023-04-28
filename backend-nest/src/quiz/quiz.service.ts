import { Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery } from 'lib/db/dao';

@Injectable()
export class QuizService {
  getHello(): string {
    return 'Hello World!';
  }

  // ファイル名リスト取得
  async getFileList() {
    return await execQuery(SQL.QUIZ_FILE.LIST, []);
  }

  // 問題取得
  async getQuiz(file_num: number, quiz_num: number) {
    try {
      const data = await execQuery(SQL.QUIZ.GET, [file_num, quiz_num]);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // 問題ランダム取得
  async getRandomQuiz(
    file_num: number,
    min_rate: number,
    max_rate: number,
    category: string,
    checked: boolean,
  ) {
    try {
      const categorySQL =
        category !== null && category !== undefined
          ? ` AND category LIKE '%` + category + `%' `
          : '';

      const checkedSQL = checked ? ` AND checked = 1 ` : '';

      const sql =
        SQL.QUIZ.RANDOM +
        categorySQL +
        checkedSQL +
        ' ORDER BY rand() LIMIT 1; ';
      return await execQuery(sql, [file_num, min_rate, max_rate]);
    } catch (error) {
      throw error;
    }
  }
}
