import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from '../../config/sql';
import { execQuery, execTransaction } from '../../lib/db/dao';
import { TransactionQuery } from '../../interfaces/db';
import {
  ReplaceAllCategorAPIRequestDto,
  GetCategoryAPIResponseDto,
  GetAccuracyRateByCategoryAPIResponseDto,
} from 'quizzer-lib';

@Injectable()
export class CategoryService {
  // カテゴリリスト(ファイルごと)取得
  async getCategoryList(file_num: number) {
    try {
      const result: GetCategoryAPIResponseDto[] = await execQuery(
        SQL.CATEGORY.INFO,
        [file_num],
      );
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

  // カテゴリ総入れ替え
  async replaceAllCategory(req: ReplaceAllCategorAPIRequestDto) {
    try {
      const { file_num } = req;

      //指定ファイルのカテゴリ取得
      const results: GetCategoryAPIResponseDto[] = await execQuery(
        SQL.QUIZ.CATEGORY.DISTINCT,
        [file_num],
      );

      //カテゴリデータ作成
      let categories: Set<string> = new Set([]);
      // eslint-disable-next-line no-var
      for (var i = 0; i < results.length; i++) {
        const result_i: Set<string> = new Set(
          results[i]['category'].split(':'),
        );
        categories = new Set([...result_i, ...categories]);
      }
      const categoriesArray: string[] = Array.from(categories);
      const data: [number, string][] = [];
      // eslint-disable-next-line no-var
      for (var i = 0; i < categoriesArray.length; i++) {
        data.push([file_num, categoriesArray[i]]);
      }

      // トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];
      //まず指定ファイルのカテゴリを全削除
      transactionQuery.push({
        query: SQL.CATEGORY.DELETE,
        value: [file_num],
      });

      //カテゴリデータ全挿入
      for (let i = 0; i < data.length; i++) {
        transactionQuery.push({
          query: SQL.CATEGORY.ADD,
          value: data[i],
        });
      }
      //トランザクション実行
      const result = await execTransaction(transactionQuery);

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

  // カテゴリ正解率取得
  async getAccuracyRateByCategory(file_num: number) {
    try {
      const result: GetAccuracyRateByCategoryAPIResponseDto = {
        result: [],
        checked_result: [],
      };

      // カテゴリビューから指定ファイルのカテゴリ毎の正解率取得
      result['result'] = await execQuery(SQL.CATEGORY.ACCURRACYRATE, [
        file_num,
      ]);

      // チェック済問題の正解率取得
      result['checked_result'] = await execQuery(SQL.QUIZ.ACCURACYRATE, [
        file_num,
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
}
