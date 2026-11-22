import { addQuizAPIRequestSchema, editQuizAPIRequestSchema } from 'quizzer-lib';

// 問題追加・編集APIのリクエストで、コピペで紛れ込むNUL文字(\u0000)を取り除くことの確認
// （PostgreSQLのテキストにはNUL文字を保存できず、そのまま保存すると500エラーになるため）
describe('問題追加・編集APIのリクエスト - NUL文字の除去', () => {
  const content = {
    file_num: 1,
    format_id: 3,
    question: '問\u0000題文',
    answer: '\u0000答え',
    explanation: '解説\u0000',
    category: 'カテ\u0000ゴリ1, カテゴリ2',
    dummyChoice: [
      { sentense: ' ダミー\u00001 ', isCorrect: false },
      { sentense: 'ダミー2', isCorrect: false },
      { sentense: 'ダミー3', isCorrect: false },
    ],
  };

  it('問題追加：問題文・答え・解説・カテゴリ・ダミー選択肢からNUL文字を取り除く', () => {
    const result = addQuizAPIRequestSchema.parse(content);
    expect(result).toMatchObject({
      question: '問題文',
      answer: '答え',
      explanation: '解説',
      category: 'カテゴリ1,カテゴリ2',
    });
    // ダミー選択肢は前後の空白も除く
    expect(result.dummyChoice?.[0].sentense).toBe('ダミー1');
  });

  it('問題編集：同じくNUL文字を取り除く', () => {
    const result = editQuizAPIRequestSchema.parse({
      ...content,
      quiz_id: 1,
      quiz_num: 1,
    });
    expect(result).toMatchObject({
      question: '問題文',
      answer: '答え',
      explanation: '解説',
    });
  });

  it('NUL文字だけのダミー選択肢は空として扱い、四択問題ではエラーにする', () => {
    const result = addQuizAPIRequestSchema.safeParse({
      ...content,
      dummyChoice: [
        { sentense: '\u0000', isCorrect: false },
        { sentense: 'ダミー2', isCorrect: false },
        { sentense: 'ダミー3', isCorrect: false },
      ],
    });
    expect(result.success).toBe(false);
  });
});
