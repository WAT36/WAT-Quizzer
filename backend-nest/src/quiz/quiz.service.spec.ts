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
});
