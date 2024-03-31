import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SQL } from '../../config/sql';
import { execQuery, execTransaction } from '../../lib/db/dao';
import {
  AddExampleAPIRequestDto,
  GetPartsofSpeechAPIResponseDto,
  GetSourceAPIResponseDto,
} from 'quizzer-lib';
import { TransactionQuery } from '../../interfaces/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EnglishService {
  // 品詞取得
  async getPartsofSpeechService() {
    try {
      const data = await prisma.partsofspeech.findMany({
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 出典取得
  async getSourceService() {
    try {
      const data = await prisma.source.findMany({
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // 例文追加
  async addExampleService(req: AddExampleAPIRequestDto) {
    const { exampleEn, exampleJa, meanId } = req;
    try {
      //トランザクション実行準備
      const transactionQuery: TransactionQuery[] = [];

      // insertされるだろう例文ID計算
      const exampleWillId =
        ((await execQuery(SQL.ENGLISH.EXAMPLE.GET.MAX_ID, []))[0][
          'id'
        ] as number) + 1;

      //例文追加
      transactionQuery.push({
        query: SQL.ENGLISH.EXAMPLE.ADD,
        value: [exampleEn, exampleJa],
      });
      for (let i = 0; i < meanId.length; i++) {
        // await execQuery(SQL.ENGLISH.MEAN.EXAMPLE.ADD, [exampleId, meanId[i]]);
        transactionQuery.push({
          query: SQL.ENGLISH.MEAN.EXAMPLE.ADD,
          value: [exampleWillId, meanId[i]],
        });
      }
      //トランザクション実行
      return await execTransaction(transactionQuery);
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
