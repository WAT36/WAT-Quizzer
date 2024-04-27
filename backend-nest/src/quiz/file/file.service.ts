import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AddQuizFileAPIRequestDto,
  DeleteQuizFileAPIRequestDto,
} from 'quizzer-lib';
import { PrismaClient } from '@prisma/client';
export const prisma: PrismaClient = new PrismaClient();

export interface QueryType {
  query: string;
  value: (string | number)[];
}

export type FormatType = 'basic' | 'applied';

@Injectable()
export class QuizFileService {
  // ファイル名リスト取得
  async getFileList() {
    return await prisma.quiz_file.findMany({
      select: {
        file_num: true,
        file_name: true,
        file_nickname: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        file_num: 'asc',
      },
    });
  }

  // ファイル追加
  async addFile(req: AddQuizFileAPIRequestDto) {
    try {
      const { file_name, file_nickname } = req;
      // ファイル追加
      return await prisma.quiz_file.create({
        data: {
          file_name,
          file_nickname,
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

  // ファイル削除（とりあえず基礎問題のみ）
  async deleteFile(req: DeleteQuizFileAPIRequestDto) {
    try {
      const { file_id } = req;

      //トランザクション実行
      await prisma.$transaction(async (prisma) => {
        // 指定ファイルの問題全削除
        await prisma.quiz.updateMany({
          data: {
            updated_at: new Date(),
            deleted_at: new Date(),
          },
          where: {
            file_num: file_id,
          },
        });

        // 指定ファイルの回答ログ全削除
        await prisma.answer_log.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            file_num: file_id,
            deleted_at: null,
          },
        });

        // 指定ファイル削除
        await prisma.quiz_file.update({
          data: {
            updated_at: new Date(),
            deleted_at: new Date(),
          },
          where: {
            file_num: file_id,
          },
        });
      });
      return { result: 'Deleted.' };
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
