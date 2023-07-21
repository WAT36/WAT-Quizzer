import { Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery } from 'lib/db/dao';
import { parseStrToBool } from 'lib/str';
import {
  UpdateCategoryOfQuizDto,
  SelectQuizDto,
  AddQuizDto,
  IntegrateQuizDto,
  EditQuizDto,
} from './quiz.dto';

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
    checked: string,
  ) {
    try {
      const categorySQL =
        category && category !== ''
          ? ` AND category LIKE '%` + category + `%' `
          : '';

      const checkedSQL = parseStrToBool(checked) ? ` AND checked = 1 ` : '';

      const sql =
        SQL.QUIZ.RANDOM +
        categorySQL +
        checkedSQL +
        ' ORDER BY rand() LIMIT 1; ';
      return await execQuery(sql, [file_num, min_rate || 0, max_rate || 100]);
    } catch (error) {
      throw error;
    }
  }

  // 最低正解率問題取得
  async getWorstRateQuiz(file_num: number, category: string, checked: string) {
    try {
      const categorySQL =
        category && category !== ''
          ? ` AND category LIKE '%` + category + `%' `
          : '';

      const checkedSQL = parseStrToBool(checked) ? ` AND checked = 1 ` : '';

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
    checked: string,
  ) {
    try {
      const categorySQL =
        category && category !== ''
          ? ` AND category LIKE '%` + category + `%' `
          : '';

      const checkedSQL = parseStrToBool(checked) ? ` AND checked = 1 ` : '';

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
  async cleared(req: SelectQuizDto) {
    try {
      const { file_num, quiz_num } = req;
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
  async failed(req: SelectQuizDto) {
    try {
      const { file_num, quiz_num } = req;
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
  async add(req: AddQuizDto) {
    try {
      const { file_num, input_data } = req;
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

        // 新問題番号を取得しINSERT
        const res = await execQuery(SQL.QUIZ.MAX_QUIZ_NUM, [file_num]);
        const new_quiz_id: number = res ? res[0]['quiz_num'] + 1 : 1;
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
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 問題編集
  async edit(req: EditQuizDto) {
    try {
      const { file_num, quiz_num, question, answer, category, img_file } = req;
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
    checked: string,
    query: string,
    queryOnlyInSentense: string,
    queryOnlyInAnswer: string,
  ) {
    try {
      const categorySQL =
        category && category !== ''
          ? ` AND category LIKE '%` + category + `%' `
          : '';

      const checkedSQL = parseStrToBool(checked) ? ` AND checked = 1 ` : '';

      let querySQL = '';
      if (query && query !== '') {
        const searchInOnlySentense = parseStrToBool(queryOnlyInSentense);
        const searchInOnlyAnswer = parseStrToBool(queryOnlyInAnswer);
        if (searchInOnlySentense && !searchInOnlyAnswer) {
          querySQL += ` AND quiz_sentense LIKE '%${query || ''}%' `;
        } else if (!searchInOnlySentense && searchInOnlyAnswer) {
          querySQL += ` AND answer LIKE '%${query || ''}%' `;
        } else {
          querySQL += ` AND (quiz_sentense LIKE '%${
            query || ''
          }%' OR answer LIKE '%${query || ''}%') `;
        }
      }

      // ランダム問題取得SQL作成
      const searchQuizSQL =
        SQL.QUIZ.SEARCH +
        categorySQL +
        checkedSQL +
        querySQL +
        ' ORDER BY quiz_num; ';
      return await execQuery(searchQuizSQL, [
        file_num,
        min_rate || 0,
        max_rate || 100,
      ]);
    } catch (error) {
      throw error;
    }
  }

  // 問題削除
  async delete(req: SelectQuizDto) {
    try {
      const { file_num, quiz_num } = req;
      // 削除済にアップデート
      return await execQuery(SQL.QUIZ.DELETE, [file_num, quiz_num]);
    } catch (error) {
      throw error;
    }
  }

  // 問題統合
  async integrate(req: IntegrateQuizDto) {
    try {
      const { pre_file_num, pre_quiz_num, post_file_num, post_quiz_num } = req;
      if (pre_file_num !== post_file_num) {
        throw (
          '統合前後のファイル番号は同じにしてください (' +
          pre_file_num +
          ' != ' +
          post_file_num +
          ')'
        );
      }

      // 統合前の問題取得
      const pre_data: any = await execQuery(SQL.QUIZ.INFO, [
        pre_file_num,
        pre_quiz_num,
      ]);

      // 統合後の問題取得
      const post_data: any = await execQuery(SQL.QUIZ.INFO, [
        post_file_num,
        post_quiz_num,
      ]);

      // 統合データ作成
      const new_clear_count =
        pre_data[0]['clear_count'] + post_data[0]['clear_count'];
      const new_fail_count =
        pre_data[0]['fail_count'] + post_data[0]['fail_count'];
      const pre_category = new Set(pre_data[0]['category'].split(':'));
      const post_category = new Set(post_data[0]['category'].split(':'));
      const new_category = Array.from(
        new Set([...pre_category, ...post_category]),
      ).join(':');

      // 問題統合
      const result = [];
      let result_i = await execQuery(SQL.QUIZ.INTEGRATE, [
        new_clear_count,
        new_fail_count,
        new_category,
        post_file_num,
        post_quiz_num,
      ]);
      result.push(result_i);

      // 統合元データは削除
      result_i = await execQuery(SQL.QUIZ.DELETE, [pre_file_num, pre_quiz_num]);
      result.push(result_i);

      return result;
    } catch (error) {
      throw error;
    }
  }

  // 問題にカテゴリ追加
  async addCategoryToQuiz(req: UpdateCategoryOfQuizDto) {
    try {
      const { file_num, quiz_num, category } = req;
      // 現在のカテゴリ取得
      const nowCategory: string = (
        await execQuery(SQL.QUIZ.INFO, [file_num, quiz_num])
      )[0]['category'];

      if (nowCategory.includes(category)) {
        return {
          message: ` カテゴリ'${category}'は既に[${file_num}-${quiz_num}]に含まれています `,
        };
      }

      // カテゴリ追加
      let newCategory = nowCategory + ':' + category;
      while (newCategory.includes('::')) {
        newCategory = newCategory.replace('::', ':');
      }

      // 更新
      const result = await execQuery(SQL.QUIZ.CATEGORY.UPDATE, [
        newCategory,
        file_num,
        quiz_num,
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  }

  // 問題からカテゴリ削除
  async removeCategoryFromQuiz(body: UpdateCategoryOfQuizDto) {
    try {
      const { file_num, quiz_num, category } = body;
      // 現在のカテゴリ取得
      let nowCategory: any = await execQuery(SQL.QUIZ.INFO, [
        file_num,
        quiz_num,
      ]);
      nowCategory = nowCategory[0]['category'];

      // 指定カテゴリが含まれているか確認、含まれていなければ終了
      if (!nowCategory.includes(category)) {
        return {
          result: null,
        };
      }

      // カテゴリ削除
      let newCategory: string = nowCategory.replace(category, '');
      if (newCategory[0] === ':') {
        newCategory = newCategory.slice(1);
      }
      if (newCategory.slice(-1) === ':') {
        newCategory = newCategory.slice(0, -1);
      }
      while (newCategory.includes('::')) {
        newCategory = newCategory.replace('::', ':');
      }

      // 更新
      const result = await execQuery(SQL.QUIZ.CATEGORY.UPDATE, [
        newCategory,
        file_num,
        quiz_num,
      ]);

      return {
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  // 問題にチェック追加
  async check(req: SelectQuizDto) {
    try {
      const { file_num, quiz_num } = req;
      // 更新
      return await execQuery(SQL.QUIZ.CHECK, [file_num, quiz_num]);
    } catch (error) {
      throw error;
    }
  }

  // 問題にチェック外す
  async uncheck(req: SelectQuizDto) {
    try {
      const { file_num, quiz_num } = req;
      // 更新
      return await execQuery(SQL.QUIZ.UNCHECK, [file_num, quiz_num]);
    } catch (error) {
      throw error;
    }
  }

  // 問題のチェック反転
  async reverseCheck(req: SelectQuizDto) {
    try {
      const { file_num, quiz_num } = req;
      // チェック取得
      const result: any = await execQuery(SQL.QUIZ.INFO, [file_num, quiz_num]);
      const checked = result[0].checked;

      const response = await execQuery(
        checked ? SQL.QUIZ.UNCHECK : SQL.QUIZ.CHECK,
        [file_num, quiz_num],
      );

      // チェックしたらtrue、チェック外したらfalseを返す
      return !checked;
    } catch (error) {
      throw error;
    }
  }
}
