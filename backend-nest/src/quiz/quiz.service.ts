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
      const data = await execQuery(SQL.QUIZ.INFO, [file_num, quiz_num]);
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

  // 最低正解率問題取得
  async getWorstRateQuiz(file_num: number, category: string, checked: boolean) {
    try {
      let categorySQL = '';
      if (category !== null && category !== undefined) {
        categorySQL = ` AND category LIKE '%` + category + `%' `;
      }

      let checkedSQL = '';
      if (checked) {
        checkedSQL += ` AND checked = 1 `;
      }

      // 最低正解率問題取得SQL作成
      const getWorstRateQuizSQL =
        SQL.QUIZ.WORST +
        categorySQL +
        checkedSQL +
        ' ORDER BY accuracy_rate LIMIT 1; ';

      return await execQuery(getWorstRateQuizSQL, [file_num]);
    } catch (error) {
      throw error;
    }
  }

  // 最小正解数問題取得
  async getMinimumAnsweredQuiz(
    file_num: number,
    category: string,
    checked: boolean,
  ) {
    try {
      let categorySQL = '';
      if (category !== null && category !== undefined) {
        categorySQL = ` AND category LIKE '%` + category + `%' `;
      }

      let checkedSQL = '';
      if (checked) {
        checkedSQL += ` AND checked = 1 `;
      }

      // ランダム問題取得SQL作成
      const getMinimumClearQuizSQL =
        SQL.QUIZ.MINIMUM +
        categorySQL +
        checkedSQL +
        ' ORDER BY clear_count LIMIT 1; ';

      return await execQuery(getMinimumClearQuizSQL, [file_num]);
    } catch (error) {
      throw error;
    }
  }

  // 正解登録
  async cleared(file_num: number, quiz_num: number) {
    try {
      // 正解数取得
      const data = await execQuery(SQL.QUIZ.CLEARED.GET, [file_num, quiz_num]);
      const clear_count = data[0].clear_count;

      // 正解登録
      return await execQuery(SQL.QUIZ.CLEARED.INPUT, [
        clear_count + 1,
        file_num,
        quiz_num,
      ]);
    } catch (error) {
      throw error;
    }
  }

  // 不正解登録
  async failed(file_num: number, quiz_num: number) {
    try {
      // 不正解数取得
      const data = await execQuery(SQL.QUIZ.FAILED.GET, [file_num, quiz_num]);
      const fail_count = data[0].fail_count;

      // 正解登録
      return await execQuery(SQL.QUIZ.FAILED.INPUT, [
        fail_count + 1,
        file_num,
        quiz_num,
      ]);
    } catch (error) {
      throw error;
    }
  }

  // 問題追加
  async add(file_num: number, input_data: string) {
    try {
      // 入力データを１行ずつに分割
      const data = input_data.split('\n');

      const result = [];

      for (let i = 0; i < data.length; i++) {
        // 入力データ作成
        const data_i = data[i].split(',');
        const question = data_i[0];
        const answer = data_i[1];
        const category = data_i[2];
        const img_file = data_i[3];

        // データのidを作成
        let new_quiz_id = -1;
        // 削除済問題がないかチェック、あればそこに入れる
        const id: any = await execQuery(SQL.QUIZ.DELETED.GET, [file_num]);
        if (id.length > 0) {
          //削除済問題がある場合はそこに入れる
          new_quiz_id = id[0]['quiz_num'];
          await execQuery(SQL.QUIZ.EDIT, [
            question,
            answer,
            category,
            img_file,
            file_num,
            new_quiz_id,
          ]);
          result.push(
            'Added!! [' +
              file_num +
              '-' +
              new_quiz_id +
              ']:' +
              question +
              ',' +
              answer,
          );
        } else {
          //削除済問題がない場合は普通にINSERT
          const now_count: any = await execQuery(SQL.QUIZ.COUNT, [file_num]);
          new_quiz_id = now_count[0]['count(*)'] + 1;
          await execQuery(SQL.QUIZ.ADD, [
            file_num,
            new_quiz_id,
            question,
            answer,
            category,
            img_file,
          ]);
          result.push(
            'Added!! [' +
              file_num +
              '-' +
              new_quiz_id +
              ']:' +
              question +
              ',' +
              answer,
          );
        }
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 問題編集
  async edit(
    file_num: number,
    quiz_num: number,
    question: string,
    answer: string,
    category: string,
    img_file: string,
  ) {
    try {
      return await execQuery(SQL.QUIZ.EDIT, [
        question,
        answer,
        category,
        img_file,
        file_num,
        quiz_num,
      ]);
    } catch (error) {
      throw error;
    }
  }

  // 問題検索
  async search(
    file_num: number,
    min_rate: number,
    max_rate: number,
    category: string,
    checked: boolean,
    query: string,
    cond: any,
  ) {
    try {
      let categorySQL = '';
      if (category !== null && category !== undefined) {
        categorySQL = ` AND category LIKE '%` + category + `%' `;
      }

      let checkedSQL = '';
      if (checked) {
        checkedSQL += ` AND checked = 1 `;
      }

      let querySQL = '';
      const cond_question =
        cond !== undefined &&
        cond.question !== undefined &&
        cond.question === true
          ? true
          : false;
      const cond_answer =
        cond !== undefined && cond.answer !== undefined && cond.answer === true
          ? true
          : false;
      if (cond_question && !cond_answer) {
        querySQL += ` AND quiz_sentense LIKE '%` + query + `%' `;
      } else if (!cond_question && cond_answer) {
        querySQL += ` AND answer LIKE '%` + query + `%' `;
      } else {
        querySQL +=
          ` AND (quiz_sentense LIKE '%` +
          query +
          `%' OR answer LIKE '%` +
          query +
          `%') `;
      }

      // ランダム問題取得SQL作成
      const searchQuizSQL =
        SQL.QUIZ.SEARCH +
        categorySQL +
        checkedSQL +
        querySQL +
        ' ORDER BY quiz_num; ';

      return await execQuery(searchQuizSQL, [file_num, min_rate, max_rate]);
    } catch (error) {
      throw error;
    }
  }
}
