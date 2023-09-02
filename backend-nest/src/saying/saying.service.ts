import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from 'config/sql';
import { execQuery } from 'lib/db/dao';

@Injectable()
export class SayingService {
  // 格言ランダム取得
  async getRandomSaying(book_id?: number) {
    try {
      if (book_id) {
        return await execQuery(SQL.SAYING.GET.RANDOM.BYBOOK, [book_id]);
      } else {
        return await execQuery(SQL.SAYING.GET.RANDOM.ALL, []);
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
}
