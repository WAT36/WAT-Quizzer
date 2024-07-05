import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddExampleAPIRequestDto } from 'quizzer-lib';
import { PrismaClient } from '@prisma/client';
export const prisma: PrismaClient = new PrismaClient();

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
    const { exampleEn, exampleJa, wordName } = req;

    // 入力単語存在チェック
    const wordData = await prisma.word.findUnique({
      where: {
        name: wordName,
      },
      select: {
        id: true,
      },
    });
    if (!wordData) {
      throw new HttpException(
        `エラー：入力した単語名「${wordName}は存在しません」`,
        HttpStatus.NOT_FOUND,
      );
    }

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

        //  word_exampleにデータ追加
        await prisma.word_example.create({
          data: {
            example_sentense_id: createdExampleData.id,
            word_id: wordData.id,
          },
        });
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
