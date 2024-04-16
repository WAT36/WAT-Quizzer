import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AddBookAPIRequestDto,
  AddSayingAPIRequestDto,
  EditSayingAPIRequestDto,
  getRandomElementsFromArray,
} from 'quizzer-lib';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SayingService {
  // 格言ランダム取得
  async getRandomSaying(book_id?: number) {
    try {
      if (book_id) {
        return getRandomElementsFromArray(
          await prisma.saying.findMany({
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
          }),
          1,
        );
      } else {
        return getRandomElementsFromArray(
          await prisma.saying.findMany({
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
          }),
          1,
        );
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
      return await prisma.selfhelp_book.create({
        data: {
          name: book_name,
        },
      });
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
      return await prisma.selfhelp_book.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          deleted_at: null,
        },
        orderBy: {
          id: 'asc',
        },
      });
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
      const result = await prisma.saying.groupBy({
        by: ['book_id'],
        where: {
          book_id,
        },
        _max: {
          book_saying_id: true,
        },
      });
      const sayingWillId =
        result.length > 0 ? +result[0]._max.book_saying_id + 1 : 1;
      // 格言追加
      return await prisma.saying.create({
        data: {
          book_id,
          book_saying_id: sayingWillId,
          saying,
          explanation,
        },
      });
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
      return await prisma.saying.findMany({
        select: {
          id: true,
          saying: true,
          explanation: true,
          selfhelp_book: {
            select: {
              name: true,
            },
          },
        },
        where: {
          saying: {
            contains: saying,
          },
          deleted_at: null,
          selfhelp_book: {
            deleted_at: null,
          },
        },
      });
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
      return await prisma.saying.findUnique({
        select: {
          saying: true,
          explanation: true,
        },
        where: {
          id,
          deleted_at: null,
        },
      });
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
      return await prisma.saying.update({
        data: {
          saying,
          explanation,
          updated_at: new Date(),
        },
        where: {
          id,
        },
      });
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
