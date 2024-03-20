import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from '../../config/sql';
import { execQuery } from '../../lib/db/dao';
import {
  AddBookAPIRequestDto,
  AddSayingAPIRequestDto,
  EditSayingAPIRequestDto,
} from 'quizzer-lib';

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

  // 啓発本追加
  async addBookService(req: AddBookAPIRequestDto) {
    const { book_name } = req;
    try {
      return await execQuery(SQL.SELFHELP_BOOK.ADD, [book_name]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 啓発本リスト取得
  async getBookListService() {
    try {
      return await execQuery(SQL.SELFHELP_BOOK.GET.ALL, []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 格言追加
  async addSayingService(req: AddSayingAPIRequestDto) {
    const { book_id, saying, explanation } = req;
    try {
      // 格言の新規ID計算
      const result = await execQuery(SQL.SAYING.GET.ID.BYBOOK, [book_id]);
      const sayingWillId =
        result.length > 0 ? +result[0]['book_saying_id'] + 1 : 1;
      // 格言追加
      return await execQuery(SQL.SAYING.ADD, [
        book_id,
        sayingWillId,
        saying,
        explanation,
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

  // 格言検索
  async searchSayingService(saying: string) {
    try {
      return await execQuery(SQL.SAYING.GET.SEARCH(saying), []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 格言取得(ID指定)
  async getSayingByIdService(id: number) {
    try {
      return await execQuery(SQL.SAYING.GET.BYID, [id]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 格言編集
  async editSayingService(req: EditSayingAPIRequestDto) {
    try {
      const { id, saying, explanation } = req;
      return await execQuery(SQL.SAYING.EDIT, [saying, explanation, id]);
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
