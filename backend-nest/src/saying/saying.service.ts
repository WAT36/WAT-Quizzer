import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from '../../config/sql';
import { execQuery } from '../../lib/db/dao';
import {
  AddBookAPIRequestDto,
  AddSayingAPIRequestDto,
  EditSayingAPIRequestDto,
  GetSayingAPIResponseDto,
  GetBookAPIResponseDto,
} from 'quizzer-lib';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SayingService {
  // 格言ランダム取得
  async getRandomSaying(book_id?: number) {
    try {
      if (book_id) {
        return await prisma.saying.findMany({
          select: {
            saying: true,
            explanation: true,
            selfhelp_book: {
              select: {
                name: true,
              },
            },
          },
          where: {
            deleted_at: null,
            selfhelp_book: {
              id: book_id,
              deleted_at: null,
            },
          },
          // skip: // TODO prismaでのランダム処理
          take: 1,
        });
      } else {
        return await prisma.saying.findMany({
          select: {
            saying: true,
            explanation: true,
            selfhelp_book: {
              select: {
                name: true,
              },
            },
          },
          where: {
            deleted_at: null,
            selfhelp_book: {
              deleted_at: null,
            },
          },
          // skip: // TODO prismaでのランダム処理
          take: 1,
        });
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
      const result: GetBookAPIResponseDto[] = await execQuery(
        SQL.SELFHELP_BOOK.GET.ALL,
        [],
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
      const result: GetSayingAPIResponseDto[] = await execQuery(
        SQL.SAYING.GET.SEARCH(saying),
        [],
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

  // 格言取得(ID指定)
  async getSayingByIdService(id: number) {
    try {
      const result: GetSayingAPIResponseDto[] = await execQuery(
        SQL.SAYING.GET.BYID,
        [id],
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
