import { Injectable } from '@nestjs/common';
import {
  AddBookAPIRequestDto,
  AddSayingAPIRequestDto,
  EditSayingAPIRequestDto,
  getRandomElementFromArray,
  prisma,
} from 'quizzer-lib';
import { parseCsv } from '../common/csv/parseCsv';
import { validateSayingCsv } from './csv/sayingCsv.validator';

@Injectable()
export class SayingService {
  // 格言ランダム取得
  async getRandomSaying(book_id?: number) {
    if (book_id) {
      return getRandomElementFromArray(
        await prisma.saying.findMany({
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
            deleted_at: null,
            selfhelp_book: {
              id: book_id,
              deleted_at: null,
            },
          },
        }),
      );
    } else {
      return getRandomElementFromArray(
        await prisma.saying.findMany({
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
            deleted_at: null,
            selfhelp_book: {
              deleted_at: null,
            },
          },
        }),
      );
    }
  }

  // 啓発本追加
  async addBookService(req: AddBookAPIRequestDto) {
    const { book_name } = req;
    return await prisma.selfhelp_book.create({
      data: {
        name: book_name,
      },
    });
  }

  // 啓発本リスト取得
  async getBookListService() {
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
  }

  // 格言追加
  async addSayingService(req: AddSayingAPIRequestDto) {
    const { book_id, saying, explanation } = req;
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
  }

  // 格言検索
  async searchSayingService(saying: string) {
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
  }

  // 格言取得(ID指定)
  async getSayingByIdService(id: number) {
    return await prisma.saying.findUnique({
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
        id,
        deleted_at: null,
      },
    });
  }

  // 格言編集
  async editSayingService(req: EditSayingAPIRequestDto) {
    const { id, saying, explanation } = req;
    return await prisma.saying.update({
      data: {
        saying,
        explanation,
      },
      where: {
        id,
      },
    });
  }

  // アップロードされた格言CSVを登録
  async uploadFile(file: Express.Multer.File) {
    const csvData = await parseCsv(file);
    const { book_id, records } = await validateSayingCsv(prisma, csvData);
    // トランザクション
    await prisma.$transaction(
      async (prisma) => {
        // 本ごとの次の格言番号（格言がまだない本は1から振る）
        const maxSayingId = await prisma.saying.aggregate({
          _max: { book_saying_id: true },
          where: { book_id },
        });
        const firstSayingId = (maxSayingId._max.book_saying_id ?? 0) + 1;
        await prisma.saying.createMany({
          data: records.map(({ saying, explanation }, index) => ({
            book_id,
            book_saying_id: firstSayingId + index,
            saying,
            explanation,
          })),
        });
        console.log(`OK: ${records.length}件登録`);
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    );
    return { result: 'All Registered!!' };
  }
}
