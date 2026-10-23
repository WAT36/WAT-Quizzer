import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AddQuizFileApiRequest,
  DeleteQuizFileApiRequest,
  GetQuizFileStatisticsAPIRequestDto,
  prisma,
  QuizFileStatisticsApiResponse,
} from 'quizzer-lib';
import { Parser } from 'json2csv';
import { QUIZ_CSV_HEADER } from '../../constants';

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

  // ファイル統計ビューデータ取得
  async getFileStatisticsData(
    req: GetQuizFileStatisticsAPIRequestDto,
  ): Promise<QuizFileStatisticsApiResponse> {
    const { file_num } = req;
    if (file_num !== -1) {
      const result = await prisma.quiz_file_view.findUnique({
        select: {
          file_num: true,
          file_name: true,
          file_nickname: true,
          count: true,
          clear: true,
          fail: true,
          not_answered: true,
          accuracy_rate: true,
          process_rate: true,
        },
        where: {
          file_num,
        },
      });
      return {
        ...result,
        count: Number(result.count),
        clear: Number(result.clear),
        fail: Number(result.fail),
        not_answered: Number(result.not_answered),
        accuracy_rate: Number(result.accuracy_rate),
        process_rate: Number(result.process_rate),
      };
    } else {
      const result = (
        await prisma.quiz_file_view.aggregate({
          _sum: {
            count: true,
            clear: true,
            fail: true,
            not_answered: true,
          },
        })
      )._sum;

      return {
        file_num: -1,
        file_name: 'all',
        file_nickname: '全総合',
        count: Number(result.count),
        clear: Number(result.clear),
        fail: Number(result.fail),
        not_answered: Number(result.not_answered),
        accuracy_rate:
          Number(result.clear) + Number(result.fail) !== 0
            ? (100 * Number(result.clear)) /
              (Number(result.clear) + Number(result.fail))
            : 0,

        process_rate:
          Number(result.count) !== 0
            ? (100 * (Number(result.clear) + Number(result.fail))) /
              Number(result.count)
            : 0,
      };
    }
  }

  // ファイル追加
  async addFile(req: AddQuizFileApiRequest) {
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
  async deleteFile(req: DeleteQuizFileApiRequest) {
    try {
      const { file_id } = req;

      //トランザクション実行
      await prisma.$transaction(async (prisma) => {
        // 指定ファイルの問題全削除
        await prisma.quiz.updateMany({
          data: {
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
            quiz: {
              file_num: file_id,
            },
            deleted_at: null,
          },
        });

        // 指定ファイル削除
        await prisma.quiz_file.update({
          data: {
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

  // 問題リストダウンロード
  async downloadCsv(file_num: number) {
    try {
      const records = (
        await prisma.quiz.findMany({
          select: {
            quiz_num: true,
            quiz_sentense: true,
            answer: true,
            img_file: true,
            checked: true,
            quiz_statistics_view: {
              select: {
                clear_count: true,
                fail_count: true,
                accuracy_rate: true,
              },
            },
            quiz_dummy_choice: {
              select: {
                dummy_choice_sentense: true,
              },
              orderBy: {
                id: 'asc',
              },
            },
          },
          where: {
            file_num,
          },
          orderBy: {
            quiz_num: 'asc',
          },
        })
      ).map((data) => {
        return {
          quiz_num: data.quiz_num,
          quiz_sentense: data.quiz_sentense,
          answer: data.answer,
          dummy1: data.quiz_dummy_choice[0]
            ? data.quiz_dummy_choice[0].dummy_choice_sentense
            : '',
          dummy2: data.quiz_dummy_choice[1]
            ? data.quiz_dummy_choice[1].dummy_choice_sentense
            : '',
          dummy3: data.quiz_dummy_choice[2]
            ? data.quiz_dummy_choice[2].dummy_choice_sentense
            : '',
          img_file: data.img_file,
          checked: data.checked,
          clear_count: data.quiz_statistics_view.clear_count,
          fail_count: data.quiz_statistics_view.fail_count,
          accuracy_rate: data.quiz_statistics_view.accuracy_rate,
        };
      });
      const json2csvParser = new Parser({ fields: QUIZ_CSV_HEADER });
      return json2csvParser.parse(records);
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
