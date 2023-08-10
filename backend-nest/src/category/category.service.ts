import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery } from 'lib/db/dao';
import { SelectFileDto } from './category.dto';

@Injectable()
export class CategoryService {
  getHello(): string {
    return 'Hello World!';
  }

  // 問題ファイルリスト取得
  async getCategoryList(file_num: number) {
    try {
      return await execQuery(SQL.CATEGORY.INFO, [file_num]);
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
  async replaceAllCategory(req: SelectFileDto) {
    try {
      const { file_num } = req;
      //まずカテゴリを全削除
      let data: any = await execQuery(SQL.CATEGORY.DELETE, [file_num]);

      //指定ファイルのカテゴリ取得
      const results: any = await execQuery(SQL.QUIZ.CATEGORY.DISTINCT, [
        file_num,
      ]);

      //カテゴリデータ作成
      let categories: any = new Set([]);
      // eslint-disable-next-line no-var
      for (var i = 0; i < results.length; i++) {
        const result_i = new Set(results[i]['category'].split(':'));
        categories = new Set([...result_i, ...categories]);
      }
      categories = Array.from(categories);
      data = [];
      // eslint-disable-next-line no-var
      for (var i = 0; i < categories.length; i++) {
        data.push([file_num, categories[i]]);
      }

      //カテゴリデータ全挿入
      const result = await execQuery(SQL.CATEGORY.ADD, [data]);

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
      const result: any = {
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
