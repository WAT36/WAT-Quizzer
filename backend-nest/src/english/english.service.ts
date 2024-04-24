import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddExampleAPIRequestDto } from 'quizzer-lib';
import { prisma } from 'quizzer-db';

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
      //トランザクション実行
      await prisma.$transaction(async (prisma) => {
        //例文追加
        const createdExampleData = await prisma.example.create({
          data: {
            en_example_sentense: exampleEn,
            ja_example_sentense: exampleJa,
          },
        });

        for (let i = 0; i < meanId.length; i++) {
          //  mean_exampleにデータ追加
          await prisma.mean_example.create({
            data: {
              example_sentense_id: createdExampleData.id,
              mean_id: meanId[i],
            },
          });
        }
      });
      return {
        result: 'Added!',
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
}
