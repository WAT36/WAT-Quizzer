import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from '../../config/sql';
import { execQuery, execTransaction } from '../../lib/db/dao';
import {
  GetQuizNumSqlResultDto,
  QuizDto,
  GetIdDto,
  GetLinkedBasisIdDto,
} from '../../interfaces/api/request/quiz';
import { TransactionQuery } from '../../interfaces/db';
import { getDifferenceArray } from '../../lib/array';
import {
  ClearQuizAPIRequestDto,
  FailQuizAPIRequestDto,
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  DeleteQuizAPIRequestDto,
  IntegrateQuizAPIRequestDto,
  UpdateCategoryOfQuizAPIRequestDto,
  RemoveCategoryOfQuizAPIRequestDto,
  CheckQuizAPIRequestDto,
  DeleteQuizFileAPIRequestDto,
  GetQuizApiResponseDto,
} from 'quizzer-lib';

export interface QueryType {
  query: string;
  value: (string | number)[];
}

export type FormatType = 'basic' | 'applied';

@Injectable()
export class QuizService {
  // 問題取得
  async getQuiz(file_num: number, quiz_num: number, format = 'basic') {
    if (file_num <= 0 || quiz_num <= 0) {
      throw new HttpException(
        `ファイル番号または問題番号が入力されていません`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      let query: QueryType;
      let linkedBasisId: string;
      let ids: { basis_quiz_id: string }[];
      let idArray: string[];
      switch (format) {
        case 'basic':
          query = { query: SQL.QUIZ.INFO, value: [file_num, quiz_num] };
          break;
        case 'applied':
          query = {
            query: SQL.ADVANCED_QUIZ.INFO,
            value: [file_num, quiz_num],
          };
          break;
        case '4choice':
          query = {
            query: SQL.ADVANCED_QUIZ.FOUR_CHOICE.GET.DUMMY_CHOICE,
            value: [file_num, quiz_num],
          };
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      const result: GetQuizApiResponseDto[] = await execQuery(
        query.query,
        query.value,
      );

      if (format === 'applied' || format === '4choice') {
        // 関連基礎問題取得
        ids = await execQuery(SQL.ADVANCED_QUIZ.BASIC_LINKAGE.GET, [
          file_num,
          quiz_num,
        ]);
        idArray = [];
        for (let i = 0; i < ids.length; i++) {
          idArray.push(ids[i].basis_quiz_id);
        }
        linkedBasisId = idArray.length > 0 ? idArray.join(',') : undefined;
        if (linkedBasisId) {
          for (let i = 0; i < result.length; i++) {
            result[i].matched_basic_quiz_id = linkedBasisId;
          }
        }
      }
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題ランダム取得
  async getRandomQuiz(
    file_num: number,
    min_rate: number,
    max_rate: number,
    category: string,
    checked: string,
    format = 'basic',
  ) {
    try {
      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.RANDOM(category, checked);
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.RANDOM(checked);
          break;
        case '4choice':
          sql = SQL.ADVANCED_QUIZ.FOUR_CHOICE.RANDOM(checked);
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return await execQuery(sql, [file_num, min_rate || 0, max_rate || 100]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 最低正解率問題取得
  async getWorstRateQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.WORST(category, checked);
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.WORST(checked);
          break;
        case '4choice':
          sql = SQL.ADVANCED_QUIZ.FOUR_CHOICE.WORST(checked);
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return await execQuery(sql, [file_num]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 最小正解数問題取得
  // TODO 最小正解数ではなく最小回答数にした 関係事項は諸々修正
  async getMinimumAnsweredQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.MINIMUM(category, checked);
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.MINIMUM(checked);
          break;
        case '4choice':
          sql = SQL.ADVANCED_QUIZ.FOUR_CHOICE.MINIMUM(checked);
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return await execQuery(sql, [file_num]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 最後に回答してから最も長い時間が経っている問題を取得
  async getLRUQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.LRU(file_num, category, checked);
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.LRU(2, file_num, checked);
          break;
        case '4choice':
          sql = SQL.ADVANCED_QUIZ.FOUR_CHOICE.LRU(file_num, checked);
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return await execQuery(sql, []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 昨日間違えた問題を取得
  async getReviewQuiz(
    file_num: number,
    category: string,
    checked: string,
    format: string,
  ) {
    try {
      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.REVIEW(file_num, category, checked);
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.REVIEW(2, file_num, checked);
          break;
        case '4choice':
          sql = SQL.ADVANCED_QUIZ.FOUR_CHOICE.REVIEW(file_num, checked);
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return await execQuery(sql, []);
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
  async cleared(req: ClearQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, format } = req;
      let query: QueryType;
      switch (format) {
        case 'basic': // 基礎問題
          query = {
            query: SQL.QUIZ.CLEARED.INPUT,
            value: [file_num, quiz_num],
          };
          break;
        case 'applied': // 応用問題
          query = {
            query: SQL.ADVANCED_QUIZ.CLEARED.INPUT,
            value: [file_num, quiz_num],
          };
          break;
        case '4choice': // 四択問題
          query = {
            query: SQL.ADVANCED_QUIZ.FOUR_CHOICE.CLEARED,
            value: [file_num, quiz_num],
          };
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return await execQuery(query.query, query.value);
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
  async failed(req: FailQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, format } = req;
      let query: QueryType;
      switch (format) {
        case 'basic': // 基礎問題
          query = {
            query: SQL.QUIZ.FAILED.INPUT,
            value: [file_num, quiz_num],
          };
          break;
        case 'applied': // 応用問題
          query = {
            query: SQL.ADVANCED_QUIZ.FAILED.INPUT,
            value: [file_num, quiz_num],
          };
          break;
        case '4choice': // 四択問題
          query = {
            query: SQL.ADVANCED_QUIZ.FOUR_CHOICE.FAILED,
            value: [file_num, quiz_num],
          };
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return await execQuery(query.query, query.value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題を１問追加
  async add(req: AddQuizAPIRequestDto) {
    try {
      const { file_num, input_data } = req;
      if (!file_num && !input_data) {
        throw new HttpException(
          `ファイル番号または問題文が入力されていません。(file_num:${file_num},input_data:${JSON.stringify(
            input_data,
          )})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { question, answer, category, img_file } = input_data;

      // 新問題番号を取得しINSERT
      const res: GetQuizNumSqlResultDto[] = await execQuery(
        SQL.QUIZ.MAX_QUIZ_NUM,
        [file_num],
      );
      const new_quiz_id: number =
        res && res.length > 0 ? res[0]['quiz_num'] + 1 : 1;
      await execQuery(SQL.QUIZ.ADD, [
        file_num,
        new_quiz_id,
        question,
        answer,
        category,
        img_file,
      ]);
      return [
        {
          result:
            'Added!! [' +
            file_num +
            '-' +
            new_quiz_id +
            ']:' +
            question +
            ',' +
            answer,
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

  // 問題編集
  async edit(req: EditQuizAPIRequestDto) {
    try {
      const {
        format,
        file_num,
        quiz_num,
        question,
        answer,
        category,
        img_file,
        matched_basic_quiz_id,
        dummy1,
        dummy2,
        dummy3,
        explanation,
      } = req;

      // クエリ用意
      let editSql: string;
      let editSqlValue: (number | string)[];
      let deleteLogSqlValue: (number | string)[];
      switch (format) {
        case 'basic':
          editSql = SQL.QUIZ.EDIT;
          editSqlValue = [
            question,
            answer,
            category,
            img_file,
            file_num,
            quiz_num,
          ];
          deleteLogSqlValue = [1, file_num, quiz_num];
          break;
        case 'applied':
          editSql = SQL.ADVANCED_QUIZ.EDIT;
          editSqlValue = [question, answer, img_file, file_num, quiz_num];
          deleteLogSqlValue = [2, file_num, quiz_num];
          break;
        case '4choice':
          editSql = SQL.ADVANCED_QUIZ.FOUR_CHOICE.EDIT.ADVANCED_QUIZ;
          editSqlValue = [question, answer, img_file, file_num, quiz_num];
          deleteLogSqlValue = [2, file_num, quiz_num];
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }

      // トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      transactionQuery.push({
        query: editSql,
        value: editSqlValue,
      });

      // 四択問題時 ダミー選択肢の編集
      if (format === '4choice') {
        // 問題番号を取得
        const res: GetQuizNumSqlResultDto[] = await execQuery(
          SQL.ADVANCED_QUIZ.FOUR_CHOICE.GET.DUMMY_CHOICE,
          [file_num, quiz_num],
        );
        const advanced_quiz_id: number =
          res && res.length > 0 ? res[0]['id'] : -1;
        // ダミー選択肢編集
        const dummyChoices = [dummy1, dummy2, dummy3];
        for (let i = 0; i < dummyChoices.length; i++) {
          // 編集対象ダミー選択肢のID取得
          const res: GetIdDto[] = await execQuery(
            SQL.ADVANCED_QUIZ.FOUR_CHOICE.EDIT.DUMMY_CHOICE.GET_DUMMY_CHOICE_ID,
            [advanced_quiz_id, i],
          );
          const id: number = res && res.length > 0 ? res[0]['id'] : -1;
          //編集対象ダミー選択肢の更新
          if (id === -1) {
            transactionQuery.push({
              query: SQL.ADVANCED_QUIZ.FOUR_CHOICE.EDIT.DUMMY_CHOICE.INSERT,
              value: [advanced_quiz_id, dummyChoices[i]],
            });
          } else {
            transactionQuery.push({
              query: SQL.ADVANCED_QUIZ.FOUR_CHOICE.EDIT.DUMMY_CHOICE.UPDATE,
              value: [dummyChoices[i], id],
            });
          }
        }

        // 解説文を作成
        if (explanation) {
          transactionQuery.push({
            query: SQL.ADVANCED_QUIZ.EXPLANATION.UPSERT,
            value: [advanced_quiz_id, explanation, explanation],
          });
        }
      }

      // 応用問題の場合　関連基礎問題を編集する
      if (
        matched_basic_quiz_id &&
        (format === 'applied' || format === '4choice')
      ) {
        //入力した問題番号のadvanced_quiz_idでの問題IDを取得
        const advanced_quiz_id = (
          await execQuery(SQL.ADVANCED_QUIZ.INFO, [file_num, quiz_num])
        )[0]['id'] as number;

        //編集画面で入力した関連基礎問題番号取得・バリデーション(A)
        const matched_basic_quiz_id_list: number[] = [];
        const id_list = matched_basic_quiz_id.split(',');
        for (let i = 0; i < id_list.length; i++) {
          if (isNaN(+id_list[i])) {
            throw new HttpException(
              `入力した関連基礎問題番号でエラーが発生しました；("${id_list[i]}"は数値ではありません)`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            matched_basic_quiz_id_list.push(+id_list[i]);
          }
        }

        //指定した応用問題の番号　から　応用問題テーブルでの問題IDを取得
        //指定応用問題IDから、今登録されている関連基礎問題のデータを取得(B)
        const registered_basic_quiz_id_list: number[] = [];
        const res: GetLinkedBasisIdDto[] = await execQuery(
          SQL.ADVANCED_QUIZ.FOUR_CHOICE.GET.BASIS_ADVANCED_LINK,
          [file_num, quiz_num],
        );
        for (let i = 0; i < res.length; i++) {
          registered_basic_quiz_id_list.push(res[i].basis_quiz_id);
        }

        //(A)と(B)を比較
        //(A)だけにしかないもの→関連基礎問題関連付テーブルにデータを新規追加する
        const onlyAvalueArray = getDifferenceArray(
          matched_basic_quiz_id_list,
          registered_basic_quiz_id_list,
        );
        for (let i = 0; i < onlyAvalueArray.length; i++) {
          transactionQuery.push({
            query: SQL.QUIZ_BASIS_ADVANCED_LINKAGE.ADD,
            value: [file_num, onlyAvalueArray[i], advanced_quiz_id],
          });
        }
        //(B)だけにしかないもの→関連基礎問題関連付テーブルからデータを削除する
        const onlyBvalueArray = getDifferenceArray(
          registered_basic_quiz_id_list,
          matched_basic_quiz_id_list,
        );
        for (let i = 0; i < onlyBvalueArray.length; i++) {
          transactionQuery.push({
            query: SQL.QUIZ_BASIS_ADVANCED_LINKAGE.DELETE,
            value: [file_num, onlyBvalueArray[i], advanced_quiz_id],
          });
        }
      }

      // 編集した問題の解答ログ削除
      transactionQuery.push({
        query: SQL.ANSWER_LOG.RESET,
        value: deleteLogSqlValue,
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
    format: string,
  ) {
    try {
      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.SEARCH(
            category,
            checked,
            query,
            queryOnlyInSentense,
            queryOnlyInAnswer,
          );
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.SEARCH(
            category,
            checked,
            query,
            queryOnlyInSentense,
            queryOnlyInAnswer,
          );
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      return await execQuery(sql, [file_num, min_rate || 0, max_rate || 100]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題削除
  async delete(req: DeleteQuizAPIRequestDto) {
    try {
      const { format, file_num, quiz_num } = req;

      let sql: string;
      switch (format) {
        case 'basic':
          sql = SQL.QUIZ.DELETE;
          break;
        case 'applied':
          sql = SQL.ADVANCED_QUIZ.DELETE;
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }
      // 削除済にアップデート
      return await execQuery(sql, [file_num, quiz_num]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題統合（とりあえず基礎問題のみ）
  async integrate(req: IntegrateQuizAPIRequestDto) {
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

      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      // 統合前の問題取得
      const pre_data: QuizDto[] = await execQuery(SQL.QUIZ.INFO, [
        pre_file_num,
        pre_quiz_num,
      ]);

      // 統合後の問題取得
      const post_data: QuizDto[] = await execQuery(SQL.QUIZ.INFO, [
        post_file_num,
        post_quiz_num,
      ]);

      // 統合データ作成
      const pre_category = new Set(pre_data[0]['category'].split(':'));
      const post_category = new Set(post_data[0]['category'].split(':'));
      const new_category = Array.from(
        new Set([...pre_category, ...post_category]),
      ).join(':');

      // 問題統合
      transactionQuery.push({
        query: SQL.QUIZ.INTEGRATE,
        value: [new_category, post_file_num, post_quiz_num],
      });

      // 統合元データは削除、それまでの解答ログデータも削除
      transactionQuery.push({
        query: SQL.QUIZ.DELETE,
        value: [pre_file_num, pre_quiz_num],
      });
      transactionQuery.push({
        query: SQL.ANSWER_LOG.RESET,
        value: [1, pre_file_num, pre_quiz_num],
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

  // 問題にカテゴリ追加
  async addCategoryToQuiz(req: UpdateCategoryOfQuizAPIRequestDto) {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題からカテゴリ削除
  async removeCategoryFromQuiz(body: RemoveCategoryOfQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, category } = body;
      // 現在のカテゴリ取得
      const res: QuizDto[] = await execQuery(SQL.QUIZ.INFO, [
        file_num,
        quiz_num,
      ]);
      const nowCategory = res[0]['category'];

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題にチェック追加
  async check(req: CheckQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num } = req;
      // 更新
      return await execQuery(SQL.QUIZ.CHECK, [file_num, quiz_num]);
    } catch (error) {
      throw error;
    }
  }

  // 問題にチェック外す
  async uncheck(req: CheckQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num } = req;
      // 更新
      return await execQuery(SQL.QUIZ.UNCHECK, [file_num, quiz_num]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 問題のチェック反転
  async reverseCheck(req: CheckQuizAPIRequestDto) {
    try {
      const { file_num, quiz_num, format } = req;
      let infoSql: string;
      let checkSql: string;
      let uncheckSql: string;
      switch (format) {
        case 'basic': // 基礎問題
          infoSql = SQL.QUIZ.INFO;
          checkSql = SQL.QUIZ.CHECK;
          uncheckSql = SQL.QUIZ.UNCHECK;
          break;
        case 'applied': // 応用問題
          infoSql = SQL.ADVANCED_QUIZ.INFO;
          checkSql = SQL.ADVANCED_QUIZ.CHECK;
          uncheckSql = SQL.ADVANCED_QUIZ.UNCHECK;
          break;
        default:
          throw new HttpException(
            `入力された問題形式が不正です`,
            HttpStatus.BAD_REQUEST,
          );
      }

      // チェック取得
      const result: QuizDto[] = await execQuery(infoSql, [file_num, quiz_num]);
      const checked = result[0].checked;

      await execQuery(checked ? uncheckSql : checkSql, [file_num, quiz_num]);

      // チェックしたらtrue、チェック外したらfalseを返す
      return [{ result: !checked }];
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 回答ログ削除(ファイル指定)
  async deleteAnswerLogByFile(req: DeleteQuizFileAPIRequestDto) {
    try {
      const { file_id } = req;
      // 指定ファイルの回答ログ削除
      const result = await execQuery(SQL.ANSWER_LOG.FILE.RESET, [file_id]);

      return {
        result,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 応用問題を１問追加
  async addAdvancedQuiz(req: AddQuizAPIRequestDto) {
    try {
      const { file_num, input_data } = req;
      if (!file_num && !input_data) {
        throw new HttpException(
          `ファイル番号または問題文が入力されていません。(file_num:${file_num},input_data:${JSON.stringify(
            input_data,
          )})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { question, answer, img_file, matched_basic_quiz_id } = input_data;

      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      // 関連する基礎問題番号リストのバリデーション・取得
      const matched_basic_quiz_id_list: number[] = [];
      if (matched_basic_quiz_id) {
        const id_list = matched_basic_quiz_id.split(',');
        for (let i = 0; i < id_list.length; i++) {
          if (isNaN(+id_list[i])) {
            throw new HttpException(
              `入力した関連基礎問題番号でエラーが発生しました；("${id_list[i]}"は数値ではありません)`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            matched_basic_quiz_id_list.push(+id_list[i]);
          }
        }
      }

      // 新問題番号(ファイルごとの)を取得しINSERT
      let res: GetQuizNumSqlResultDto[] = await execQuery(
        SQL.ADVANCED_QUIZ.MAX_QUIZ_NUM.BYFILE,
        [file_num],
      );
      const new_quiz_id: number =
        res && res.length > 0 ? res[0]['quiz_num'] + 1 : 1;
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.ADD,
        value: [file_num, new_quiz_id, 1, question, answer, img_file],
      });

      // 新問題番号(advanced_quiz全体での)を取得しINSERT
      res = await execQuery(SQL.ADVANCED_QUIZ.MAX_QUIZ_NUM.ALL, []);
      const new_id: number = res && res.length > 0 ? res[0]['id'] + 1 : 1;
      // 関連する基礎問題番号リストを追加
      for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
        transactionQuery.push({
          query: SQL.QUIZ_BASIS_ADVANCED_LINKAGE.ADD,
          value: [file_num, matched_basic_quiz_id_list[i], new_id],
        });
      }

      // トランザクション処理実行
      await execTransaction(transactionQuery);
      return [
        {
          result:
            'Added!! [' +
            file_num +
            '-' +
            new_quiz_id +
            ']:' +
            question +
            ',' +
            answer +
            ',関連基礎問題:' +
            JSON.stringify(matched_basic_quiz_id_list),
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

  // 四択問題を１問追加
  async addFourChoiceQuiz(req: AddQuizAPIRequestDto) {
    try {
      const { file_num, input_data } = req;
      if (!file_num && !input_data) {
        throw new HttpException(
          `ファイル番号または問題文が入力されていません。(req:${JSON.stringify(
            req,
          )},file_num:${file_num},input_data:${JSON.stringify(input_data)})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const {
        question,
        answer,
        img_file,
        matched_basic_quiz_id,
        dummy1,
        dummy2,
        dummy3,
      } = input_data;

      if (!dummy1 && !dummy2 && !dummy3) {
        throw new HttpException(
          `ダミー選択肢が3つ入力されていません。`,
          HttpStatus.BAD_REQUEST,
        );
      }

      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      // 関連する基礎問題番号リストのバリデーション・取得
      const matched_basic_quiz_id_list: number[] = [];
      if (matched_basic_quiz_id) {
        const id_list = matched_basic_quiz_id.split(',');
        for (let i = 0; i < id_list.length; i++) {
          if (isNaN(+id_list[i])) {
            throw new HttpException(
              `入力した関連基礎問題番号でエラーが発生しました；("${id_list[i]}"は数値ではありません)`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            matched_basic_quiz_id_list.push(+id_list[i]);
          }
        }
      }

      // 新問題番号(ファイルごとの)を取得しINSERT
      let res: GetQuizNumSqlResultDto[] = await execQuery(
        SQL.ADVANCED_QUIZ.MAX_QUIZ_NUM.BYFILE,
        [file_num],
      );
      const new_quiz_id: number =
        res && res.length > 0 ? res[0]['quiz_num'] + 1 : 1;
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.ADD,
        value: [file_num, new_quiz_id, 2, question, answer, img_file],
      });

      // 新問題番号(advanced_quiz全体での)を取得しINSERT
      res = await execQuery(SQL.ADVANCED_QUIZ.MAX_QUIZ_NUM.ALL, []);
      const new_id: number = res && res.length > 0 ? res[0]['id'] + 1 : 1;

      // ダミー選択肢をINSERT
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.DUMMY_CHOICE.ADD,
        value: [new_id, dummy1],
      });
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.DUMMY_CHOICE.ADD,
        value: [new_id, dummy2],
      });
      transactionQuery.push({
        query: SQL.ADVANCED_QUIZ.DUMMY_CHOICE.ADD,
        value: [new_id, dummy3],
      });

      // 関連する基礎問題番号リストを追加
      for (let i = 0; i < matched_basic_quiz_id_list.length; i++) {
        transactionQuery.push({
          query: SQL.QUIZ_BASIS_ADVANCED_LINKAGE.ADD,
          value: [file_num, matched_basic_quiz_id_list[i], new_id],
        });
      }

      // トランザクション処理実行
      await execTransaction(transactionQuery);
      return [
        {
          result:
            'Added!! [' +
            file_num +
            '-' +
            new_quiz_id +
            ']:' +
            question +
            ',' +
            answer +
            ',関連基礎問題:' +
            JSON.stringify(matched_basic_quiz_id_list),
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
}
