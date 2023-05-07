import { Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery } from 'lib/db/dao';

@Injectable()
export class CategoryService {
  getHello(): string {
    return 'Hello World!';
  }

  // 問題ファイルリスト取得
  async getCategoryList(file_num: number) {
    try {
      return await execQuery(SQL.CATEGORY.INFO, [file_num]);
    } catch (error) {
      throw error;
    }
  }
}
