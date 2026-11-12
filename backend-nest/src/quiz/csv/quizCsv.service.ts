import { Injectable } from '@nestjs/common';
import { prisma } from 'quizzer-lib';
import { parseCsv } from '../../common/csv/parseCsv';
import {
  CsvQuizRecordBase,
  validateFourChoiceQuizCsv,
  validateQuizCsv,
} from './quizCsv.validator';

// 問題CSVの一括登録
@Injectable()
export class QuizCsvService {
  // CSVから読み込んだ問題を登録する（バリデーション済みのデータを渡すこと）
  // 問題数が多くてもトランザクションの時間制限に収まるよう、各テーブルへまとめて登録する
  private async registerCsvQuizzes<T extends CsvQuizRecordBase>(
    records: T[],
    // 問題形式ごとの問題データ（問題形式・画像）
    toQuizData: (record: T) => { format_id: number; img_file?: string },
    // 四択問題のダミー選択肢
    toDummyChoices?: (
      record: T,
    ) => { dummy_choice_sentense: string; is_corrected: boolean }[],
  ) {
    const fileNums = Array.from(new Set(records.map((r) => r.file_num)));
    // ファイルごとのカテゴリ名
    const categoryNamesByFile = new Map<number, Set<string>>();
    for (const { file_num, categories } of records) {
      const names = categoryNamesByFile.get(file_num) ?? new Set<string>();
      categories.forEach((c) => names.add(c));
      categoryNamesByFile.set(file_num, names);
    }
    const categoryConditions = Array.from(categoryNamesByFile.entries())
      .filter(([, names]) => names.size > 0)
      .map(([file_num, names]) => ({ file_num, name: { in: [...names] } }));

    await prisma.$transaction(
      async (prisma) => {
        // ファイルごとの次の問題番号（削除済みも含めた最大値+1から振る）
        const maxQuizNums = await prisma.quiz.groupBy({
          by: ['file_num'],
          _max: { quiz_num: true },
          where: { file_num: { in: fileNums } },
        });
        const nextQuizNums = new Map(
          fileNums.map((file_num) => [
            file_num,
            (maxQuizNums.find((m) => m.file_num === file_num)?._max.quiz_num ??
              0) + 1,
          ]),
        );

        // カテゴリをcategoryマスターに登録（既存の削除済みカテゴリは復活させる）
        const categoryIds = new Map<string, number>();
        if (categoryConditions.length > 0) {
          await prisma.category.createMany({
            data: categoryConditions.flatMap(({ file_num, name }) =>
              name.in.map((n) => ({ name: n, file_num })),
            ),
            skipDuplicates: true,
          });
          await prisma.category.updateMany({
            data: { deleted_at: null },
            where: { OR: categoryConditions, deleted_at: { not: null } },
          });
          const categories = await prisma.category.findMany({
            select: { id: true, name: true, file_num: true },
            where: { OR: categoryConditions },
          });
          for (const { id, name, file_num } of categories) {
            categoryIds.set(`${file_num}:${name}`, id);
          }
        }

        // 問題を登録
        const createdQuizzes = await prisma.quiz.createManyAndReturn({
          select: { id: true, quiz_sentense: true },
          data: records.map((record) => {
            const quiz_num = nextQuizNums.get(record.file_num);
            nextQuizNums.set(record.file_num, quiz_num + 1);
            return {
              ...toQuizData(record),
              file_num: record.file_num,
              quiz_num,
              quiz_sentense: record.question,
              answer: record.answer,
              checked: false,
            };
          }),
        });
        // 問題文は一意なので、問題文から登録した問題のIDを引く
        const quizIds = new Map(
          createdQuizzes.map(({ id, quiz_sentense }) => [quiz_sentense, id]),
        );
        const quizIdOf = (record: T) => quizIds.get(record.question);

        // 解説を登録
        const explanations = records
          .filter((record) => record.explanation)
          .map((record) => ({
            quiz_id: quizIdOf(record),
            explanation: record.explanation,
          }));
        if (explanations.length > 0) {
          await prisma.quiz_explanation.createMany({ data: explanations });
        }

        // ダミー選択肢を登録（CSVの順に登録し、id昇順で並ぶようにする）
        if (toDummyChoices) {
          await prisma.quiz_dummy_choice.createMany({
            data: records.flatMap((record) =>
              toDummyChoices(record).map((d) => ({
                ...d,
                quiz_id: quizIdOf(record),
              })),
            ),
          });
        }

        // 問題とカテゴリを紐付け
        const categoryQuizzes = records.flatMap((record) =>
          record.categories.map((c) => ({
            quiz_id: quizIdOf(record),
            category_id: categoryIds.get(`${record.file_num}:${c}`),
          })),
        );
        if (categoryQuizzes.length > 0) {
          await prisma.category_quiz.createMany({ data: categoryQuizzes });
        }
        console.log(`OK: ${records.length}問登録`);
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    );
  }

  // アップロードされた問題CSV(基礎・応用)を登録
  async uploadFile(file: Express.Multer.File) {
    const csvData = await parseCsv(file);
    const records = await validateQuizCsv(prisma, csvData);
    await this.registerCsvQuizzes(records, (record) => ({
      format_id: record.format_id,
      img_file: record.img_file,
    }));
    return { result: 'All Registered!!' };
  }

  // アップロードされた四択問題CSVを登録
  async uploadFourChoiceFile(file: Express.Multer.File) {
    const csvData = await parseCsv(file);
    const records = await validateFourChoiceQuizCsv(prisma, csvData);
    await this.registerCsvQuizzes(
      records,
      () => ({ format_id: 3 }), // 四択問題
      // 答えの数が2以上の場合、ダミー選択肢1から順に正解とする
      (record) =>
        record.dummyChoices.map((d, index) => ({
          dummy_choice_sentense: d,
          is_corrected: index + 2 <= record.answer_num,
        })),
    );
    return { result: 'All Registered!!' };
  }
}
