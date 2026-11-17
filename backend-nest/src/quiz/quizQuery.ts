import { Prisma } from '@prisma/client';
import {
  GetQuizAPIRequestParsedDto,
  GetQuizMethod,
  SearchQuizAPIRequestParsedDto,
  SEARCH_LIMITS,
  getTodayStart,
} from 'quizzer-lib';
import { formatIdCondition } from '../common/formatId';

// 問題取得・検索のDB条件(where・orderBy・select)の組み立て
// DBにはアクセスしない（DBの値が必要な条件は呼び出し側で取得して渡す）

type QuizOrderBy =
  | Prisma.quizOrderByWithRelationInput
  | Prisma.quizOrderByWithRelationInput[];

// 問題に紐付いたカテゴリ（削除済みの紐付けも含む）
const categoryQuizSelect = {
  select: { deleted_at: true, category: { select: { name: true } } },
} satisfies Prisma.quiz$category_quizArgs;

// ---- 問題取得 ----

// 問題取得で返す項目
export const getQuizSelect = {
  id: true,
  file_num: true,
  quiz_num: true,
  format_id: true,
  quiz_sentense: true,
  answer: true,
  img_file: true,
  checked: true,
  category_quiz: categoryQuizSelect,
  quiz_statistics_view: {
    select: { clear_count: true, fail_count: true, accuracy_rate: true },
  },
  quiz_explanation: { select: { explanation: true } },
  quiz_dummy_choice: {
    select: { dummy_choice_sentense: true, is_corrected: true },
    orderBy: { id: 'asc' },
  },
  // 関連付けは、問題編集で外したもの(削除済み)を除く
  quiz_basis_linkage: {
    select: { basis_quiz_id: true, advanced_quiz_id: true },
    where: { deleted_at: null },
  },
  quiz_advanced_linkage: {
    select: { basis_quiz_id: true, advanced_quiz_id: true },
    where: { deleted_at: null },
  },
} satisfies Prisma.quizSelect;

// 取得方法ごとの並び順（ランダム系・指定なしは並び順なし）
const GET_QUIZ_ORDER_BY: Partial<Record<GetQuizMethod, QuizOrderBy>> = {
  worstRate: [
    { quiz_statistics_view: { accuracy_rate: 'asc' } },
    { quiz_statistics_view: { fail_count: 'desc' } },
    { id: 'asc' },
  ],
  leastClear: [
    { quiz_statistics_view: { answer_count: 'asc' } },
    { quiz_statistics_view: { fail_count: 'desc' } },
  ],
  LRU: {
    quiz_statistics_view: { last_answer_log: { sort: 'asc', nulls: 'first' } },
  },
  review: { quiz_statistics_view: { last_failed_answer_log: 'desc' } },
  recentlyUpdated: [{ updated_at: 'desc' }, { id: 'desc' }],
};

export const getQuizOrderBy = (method?: GetQuizMethod): QuizOrderBy =>
  (method && GET_QUIZ_ORDER_BY[method]) ?? {};

// キーワード検索条件（対象：問題文+解答 or 解説）
const keywordCondition = (
  keyword: string | undefined,
  keywordTarget: GetQuizAPIRequestParsedDto['keywordTarget'],
): Prisma.quizWhereInput | undefined => {
  if (!keyword) return undefined;
  if (keywordTarget === 'explanation') {
    return { quiz_explanation: { explanation: { contains: keyword } } };
  }
  return {
    OR: [
      { quiz_sentense: { contains: keyword } },
      { answer: { contains: keyword } },
    ],
  };
};

// 取得方法ごとの解答履歴の条件
const answerLogCondition = (
  method: GetQuizMethod,
): Prisma.quiz_statistics_viewWhereInput => {
  switch (method) {
    // 前日以前に間違えて、今日はまだ解いていない
    case 'review':
      return {
        last_failed_answer_log: { lt: getTodayStart() },
        last_answer_log: { lt: getTodayStart() },
      };
    // 今日はまだ解いていない
    case 'todayNotAnswered':
      return {
        OR: [
          { last_answer_log: { lt: getTodayStart() } },
          { last_answer_log: null },
        ],
      };
    default:
      return {};
  }
};

// 問題取得の条件
// methodがある時は条件指定、ない時は問題番号指定
export const getQuizWhere = (
  req: GetQuizAPIRequestParsedDto,
  method?: GetQuizMethod,
): Prisma.quizWhereInput => {
  const {
    file_num,
    quiz_num,
    min_rate,
    max_rate,
    category,
    checked,
    format_id,
    keyword,
    keywordTarget,
  } = req;
  if (!method) {
    return {
      file_num,
      quiz_num,
      ...formatIdCondition(format_id),
      deleted_at: null,
      ...keywordCondition(keyword, keywordTarget),
    };
  }
  // カテゴリは複数選択でカンマ区切りされてるので分割する（いずれかのカテゴリを持つ問題）
  const categories = category && category.split(',').map((s) => s.trim());
  const categoryCondition: Prisma.quizWhereInput | undefined = categories
    ? {
        OR: categories.map((name) => ({
          category_quiz: { some: { category: { name }, deleted_at: null } },
        })),
      }
    : undefined;
  // カテゴリとキーワードはどちらもORを使うため、ANDで並べて両方で絞り込む
  const andConditions = [
    categoryCondition,
    keywordCondition(keyword, keywordTarget),
  ].filter((c) => c !== undefined);
  return {
    file_num,
    ...formatIdCondition(format_id),
    deleted_at: null,
    quiz_statistics_view: {
      accuracy_rate: { gte: min_rate || 0, lte: max_rate || 100 },
      ...answerLogCondition(method),
    },
    ...(checked && { checked: true }),
    ...(andConditions.length > 0 && { AND: andConditions }),
  };
};

// ---- 問題検索 ----

// 問題検索で返す項目
export const searchQuizSelect = {
  id: true,
  file_num: true,
  quiz_num: true,
  quiz_sentense: true,
  answer: true,
  category_quiz: categoryQuizSelect,
  quiz_format: { select: { name: true } },
  quiz_statistics_view: { select: { accuracy_rate: true } },
  img_file: true,
  checked: true,
  quiz_explanation: { select: { explanation: true } },
} satisfies Prisma.quizSelect;

// 検索結果の取得範囲（result_from〜result_to件目。上限件数を超えないようにする）
export const searchQuizRange = ({
  result_from,
  result_to,
}: Pick<SearchQuizAPIRequestParsedDto, 'result_from' | 'result_to'>) => {
  const rangeCount =
    result_from !== undefined && result_to !== undefined
      ? result_to - result_from + 1
      : SEARCH_LIMITS.MAX_QUIZ_SEARCH_RESULTS;
  return {
    skip: result_from ? result_from - 1 : 0,
    take: Math.min(rangeCount, SEARCH_LIMITS.MAX_QUIZ_SEARCH_RESULTS),
  };
};

// 検索語の条件（検索対象の指定がなければ問題文・答え・解説すべてを対象にする）
const searchTextCondition = ({
  query,
  searchInOnlySentense,
  searchInOnlyAnswer,
  searchInExplanation,
}: SearchQuizAPIRequestParsedDto): Prisma.quizWhereInput | undefined => {
  if (!query) return undefined;
  const all =
    !searchInOnlySentense && !searchInOnlyAnswer && !searchInExplanation;
  const conditions: Prisma.quizWhereInput[] = [
    ...(all || searchInOnlySentense
      ? [{ quiz_sentense: { contains: query } }]
      : []),
    ...(all || searchInOnlyAnswer ? [{ answer: { contains: query } }] : []),
    ...(all || searchInExplanation
      ? [{ quiz_explanation: { explanation: { contains: query } } }]
      : []),
  ];
  return conditions.length === 1 ? conditions[0] : { OR: conditions };
};

// 問題検索の条件
// excludedChildCategories: onlyDirectCategory指定時に除外する子カテゴリ名（呼び出し側でDBから取得する）
export const searchQuizWhere = (
  req: SearchQuizAPIRequestParsedDto,
  excludedChildCategories: string[] = [],
): Prisma.quizWhereInput => {
  const {
    file_num,
    format_id,
    min_rate,
    max_rate,
    category_and,
    category_not,
    checked,
  } = req;
  // カテゴリ条件（AND:すべて含む / NOT:含まない）
  const categoryQuizWhere = (
    names: string[],
  ): Prisma.category_quizWhereInput => ({
    category: { name: { in: names }, file_num, deleted_at: null },
    deleted_at: null,
  });
  const categoryConditions: Prisma.quizWhereInput[] = [
    ...(category_and ?? []).map((name) => ({
      category_quiz: { some: categoryQuizWhere([name]) },
    })),
    ...(category_not && category_not.length > 0
      ? [{ category_quiz: { none: categoryQuizWhere(category_not) } }]
      : []),
    ...(excludedChildCategories.length > 0
      ? [
          {
            category_quiz: { none: categoryQuizWhere(excludedChildCategories) },
          },
        ]
      : []),
  ];
  return {
    ...formatIdCondition(format_id),
    file_num,
    deleted_at: null,
    quiz_statistics_view: {
      accuracy_rate: { gte: min_rate || 0, lte: max_rate || 100 },
    },
    ...(categoryConditions.length > 0 && { AND: categoryConditions }),
    ...(checked && { checked: true }),
    ...searchTextCondition(req),
  };
};
