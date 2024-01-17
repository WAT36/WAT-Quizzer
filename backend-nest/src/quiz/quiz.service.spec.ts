import * as Dao from '../../lib/db/dao';
import { QuizService } from './quiz.service';
jest.mock('../../lib/db/dao');

describe('QuizService', () => {
  let quizService: QuizService;

  beforeEach(() => {
    quizService = new QuizService();
  });

  // ファイル名リスト取得 正常系
  it('getFileList - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 0,
        file_name: '品詞テスト',
        file_nickname: '品詞テスト',
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await quizService.getFileList()).toEqual(testResult);
  });

  // ファイル名リスト取得 異常系
  it('getFileList - NG', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.getFileList()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題取得 正常系
  it('getQuiz - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        file_num: 0,
        quiz_num: 0,
        quiz_sentense: '品詞テスト',
        answer: '品詞テスト',
        category: 'カテゴリ',
        img_file: 'img',
        checked: 0,
        clear_count: 0,
        fail_count: 0,
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await quizService.getQuiz(1, 1, 'basic')).toEqual(testResult);
  });

  // 問題取得 異常系１
  it('getQuiz - NG', async () => {
    await expect(quizService.getQuiz(-1, -1, 'basic')).rejects.toMatchObject({
      message: 'ファイル番号または問題番号が入力されていません',
    });
    await expect(quizService.getQuiz(0, 1, 'basic')).rejects.toMatchObject({
      message: 'ファイル番号または問題番号が入力されていません',
    });
    await expect(quizService.getQuiz(1, 0, 'basic')).rejects.toMatchObject({
      message: 'ファイル番号または問題番号が入力されていません',
    });
    await expect(quizService.getQuiz(1, 1, 'xxxxxxxx')).rejects.toMatchObject({
      message: '入力された問題形式が不正です',
    });
  });

  // 問題取得 異常系２
  it('getQuiz - NG2', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.getQuiz(1, 1, 'basic')).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題ランダム取得 正常系
  it('getRandomQuiz - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        file_num: 0,
        quiz_num: 0,
        quiz_sentense: '品詞テスト',
        answer: '品詞テスト',
        category: 'カテゴリ',
        img_file: 'img',
        checked: 0,
        clear_count: 0,
        fail_count: 0,
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(
      await quizService.getRandomQuiz(
        1,
        0,
        100,
        'カテゴリテスト',
        'true',
        'basic',
      ),
    ).toEqual(testResult);
  });

  // 問題ランダム取得 異常系１
  it('getRandomQuiz - NG1', async () => {
    await expect(
      quizService.getRandomQuiz(
        1,
        0,
        100,
        'カテゴリテスト',
        'true',
        'xxxxxxxxxx',
      ),
    ).rejects.toMatchObject({
      message: '入力された問題形式が不正です',
    });
  });

  // 問題ランダム取得 異常系２
  it('getRandomQuiz - NG2', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      quizService.getRandomQuiz(1, 0, 100, 'カテゴリテスト', 'true', 'basic'),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 最低正解率問題取得 正常系
  it('getWorstRateQuiz - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        file_num: 0,
        quiz_num: 0,
        quiz_sentense: '品詞テスト',
        answer: '品詞テスト',
        category: 'カテゴリ',
        img_file: 'img',
        checked: 0,
        clear_count: 0,
        fail_count: 0,
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(
      await quizService.getWorstRateQuiz(1, 'カテゴリテスト', 'true', 'basic'),
    ).toEqual(testResult);
  });

  // 最低正解率問題取得 異常系１
  it('getWorstRateQuiz - NG1', async () => {
    await expect(
      quizService.getWorstRateQuiz(1, 'カテゴリテスト', 'true', 'xxxxxxxxxx'),
    ).rejects.toMatchObject({
      message: '入力された問題形式が不正です',
    });
  });

  // 最低正解率問題取得 異常系２
  it('getWorstRateQuiz - NG2', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      quizService.getWorstRateQuiz(1, 'カテゴリテスト', 'true', 'basic'),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 最小正解数問題取得 正常系
  it('getMinimumAnsweredQuiz - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        file_num: 0,
        quiz_num: 0,
        quiz_sentense: '品詞テスト',
        answer: '品詞テスト',
        category: 'カテゴリ',
        img_file: 'img',
        checked: 0,
        clear_count: 0,
        fail_count: 0,
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(
      await quizService.getMinimumAnsweredQuiz(
        1,
        'カテゴリテスト',
        'true',
        'basic',
      ),
    ).toEqual(testResult);
  });

  // 最小正解数問題取得 異常系１
  it('getMinimumAnsweredQuiz - NG1', async () => {
    await expect(
      quizService.getMinimumAnsweredQuiz(
        1,
        'カテゴリテスト',
        'true',
        'xxxxxxxxxx',
      ),
    ).rejects.toMatchObject({
      message: '入力された問題形式が不正です',
    });
  });

  // 最小正解数問題取得 異常系２
  it('getMinimumAnsweredQuiz - NG2', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      quizService.getMinimumAnsweredQuiz(1, 'カテゴリテスト', 'true', 'basic'),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 最後に回答してから最も長い時間が経っている問題を取得 正常系
  it('getLRUQuiz - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        file_num: 0,
        quiz_num: 0,
        quiz_sentense: '品詞テスト',
        answer: '品詞テスト',
        category: 'カテゴリ',
        img_file: 'img',
        checked: 0,
        clear_count: 0,
        fail_count: 0,
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(
      await quizService.getLRUQuiz(1, 'カテゴリテスト', 'true', 'basic'),
    ).toEqual(testResult);
  });

  // 最後に回答してから最も長い時間が経っている問題を取得 異常系１
  it('getLRUQuiz - NG1', async () => {
    await expect(
      quizService.getLRUQuiz(1, 'カテゴリテスト', 'true', 'xxxxxxxxxx'),
    ).rejects.toMatchObject({
      message: '入力された問題形式が不正です',
    });
  });

  // 最後に回答してから最も長い時間が経っている問題を取得 異常系２
  it('getLRUQuiz - NG2', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      quizService.getLRUQuiz(1, 'カテゴリテスト', 'true', 'basic'),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 昨日間違えた問題を取得 正常系
  it('getReviewQuiz - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        id: 0,
        file_num: 0,
        quiz_num: 0,
        quiz_sentense: '品詞テスト',
        answer: '品詞テスト',
        category: 'カテゴリ',
        img_file: 'img',
        checked: 0,
        clear_count: 0,
        fail_count: 0,
        created_at: '2000-01-01 00:00:00',
        updated_at: '2000-01-01 00:00:00',
        deleted_at: null,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(
      await quizService.getReviewQuiz(1, 'カテゴリテスト', 'true', 'basic'),
    ).toEqual(testResult);
  });

  // 昨日間違えた問題を取得 異常系１
  it('getReviewQuiz - NG1', async () => {
    await expect(
      quizService.getReviewQuiz(1, 'カテゴリテスト', 'true', 'xxxxxxxxxx'),
    ).rejects.toMatchObject({
      message: '入力された問題形式が不正です',
    });
  });

  // 昨日間違えた問題を取得 異常系２
  it('getReviewQuiz - NG2', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      quizService.getReviewQuiz(1, 'カテゴリテスト', 'true', 'basic'),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 正解登録 正常系
  it('cleared - OK', async () => {
    // テストデータ
    const req = {
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValueOnce(testResult);
    expect(await quizService.cleared(req)).toEqual(testResult);
  });

  // 正解登録 異常系１
  it('cleared - NG1', async () => {
    // テストデータ
    const req = {
      format: 'xxxxxxxxxx',
      file_num: 0,
      quiz_num: 0,
    };
    await expect(quizService.cleared(req)).rejects.toMatchObject({
      message: '入力された問題形式が不正です',
    });
  });

  // 正解登録 異常系２
  it('cleared - NG2', async () => {
    // テストデータ
    const req = {
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.cleared(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
