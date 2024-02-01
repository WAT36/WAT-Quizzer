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

  // 不正解登録 正常系
  it('failed - OK', async () => {
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
    expect(await quizService.failed(req)).toEqual(testResult);
  });

  // 不正解登録 異常系１
  it('failed - NG1', async () => {
    // テストデータ
    const req = {
      format: 'xxxxxxxxxx',
      file_num: 0,
      quiz_num: 0,
    };
    await expect(quizService.failed(req)).rejects.toMatchObject({
      message: '入力された問題形式が不正です',
    });
  });

  // 不正解登録 異常系２
  it('failed - NG2', async () => {
    // テストデータ
    const req = {
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.failed(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題を１問追加 正常系
  it('add - OK', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      input_data: {
        question: '問題文',
        answer: '答え',
        category: 'カテゴリ',
        img_file: '画像ファイル',
        matched_basic_quiz_id: '1,2,3',
        dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
        dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
        dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
      },
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        quiz_num: 1,
      },
    ];
    // 正解データ
    const correctData = [
      {
        result: `Added!! [0-2]:問題文,答え`,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.add(req)).toEqual(correctData);
  });

  // 問題を１問追加 異常系１
  it('add - NG1', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      input_data: {
        question: '問題文',
        answer: '答え',
        category: 'カテゴリ',
        img_file: '画像ファイル',
        matched_basic_quiz_id: '1,2,3',
        dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
        dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
        dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
      },
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.add(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題を１問追加 異常系２
  it('add - NG2', async () => {
    // テストデータ
    const req = {
      file_num: undefined,
      input_data: undefined,
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.add(req)).rejects.toMatchObject({
      message:
        'ファイル番号または問題文が入力されていません。(file_num:undefined,input_data:undefined)',
    });
  });

  // 問題編集 正常系1
  it('edit - OK', async () => {
    // テストデータ
    const req = {
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
      question: '問題文',
      answer: '答え',
      category: 'カテゴリ',
      img_file: '画像ファイル',
      matched_basic_quiz_id: '1,2,3',
      dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
      dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
      dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
      explanation: '説明',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        quiz_num: 1,
      },
    ];
    jest.spyOn(Dao, 'execTransaction').mockResolvedValue(testResult);
    expect(await quizService.edit(req)).toEqual({ result: testResult });
  });

  // 問題編集 異常系１
  it('edit - NG1', async () => {
    // テストデータ
    const req = {
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
      question: '問題文',
      answer: '答え',
      category: 'カテゴリ',
      img_file: '画像ファイル',
      matched_basic_quiz_id: '1,2,3',
      dummy1: 'ダミー選択肢１', //四択問題のダミー選択肢１
      dummy2: 'ダミー選択肢２', //四択問題のダミー選択肢２
      dummy3: 'ダミー選択肢３', //四択問題のダミー選択肢３
      explanation: '説明',
    };
    jest.spyOn(Dao, 'execTransaction').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.edit(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題検索 正常系1
  it('search - OK', async () => {
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(
      await quizService.search(
        0,
        0,
        100,
        'カテゴリ',
        'true',
        'クエリ',
        'true',
        'true',
        'basic',
      ),
    ).toEqual(testResult);
  });

  // 問題検索 異常系1
  it('search - NG1', async () => {
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(
      quizService.search(
        0,
        0,
        100,
        'カテゴリ',
        'true',
        'クエリ',
        'true',
        'true',
        'basic',
      ),
    ).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題削除 正常系1
  it('delete - OK', async () => {
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
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.delete(req)).toEqual(testResult);
  });

  // 問題削除 異常系1
  it('delete - NG1', async () => {
    // テストデータ
    const req = {
      format: 'basic',
      file_num: 0,
      quiz_num: 0,
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.delete(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題統合 正常系1
  it('integrate - OK', async () => {
    // テストデータ
    const req = {
      pre_file_num: 0,
      pre_quiz_num: 0,
      post_file_num: 0,
      post_quiz_num: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        category: 'カテゴリ',
      },
    ];
    // テストデータ 正常時の返り値
    const testTransactionResult = [
      {
        quiz_num: 1,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    jest.spyOn(Dao, 'execTransaction').mockResolvedValue(testTransactionResult);
    expect(await quizService.integrate(req)).toEqual({
      result: testTransactionResult,
    });
  });

  // 問題統合 異常系1
  it('integrate - NG1', async () => {
    // テストデータ
    const req = {
      pre_file_num: 0,
      pre_quiz_num: 0,
      post_file_num: 0,
      post_quiz_num: 0,
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.integrate(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題にカテゴリ追加 正常系1
  it('addCategoryToQuiz - OK', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      category: 'カテゴリ1',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        category: 'カテゴリ2',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.addCategoryToQuiz(req)).toEqual(testResult);
  });

  // 問題にカテゴリ追加 異常系1
  it('addCategoryToQuiz - NG1', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      category: 'カテゴリ1',
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.addCategoryToQuiz(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題からカテゴリ削除 正常系1
  it('removeCategoryFromQuiz - OK', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      category: 'カテゴリ1',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        category: 'カテゴリ2',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.removeCategoryFromQuiz(req)).toEqual({
      result: null,
    });
  });

  // 問題からカテゴリ削除 異常系1
  it('removeCategoryFromQuiz - NG1', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      category: 'カテゴリ1',
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.removeCategoryFromQuiz(req)).rejects.toMatchObject(
      {
        message: 'error test by jest.',
      },
    );
  });

  // 問題にチェック追加 正常系1
  it('check - OK', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      format: 'basic',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.check(req)).toEqual(testResult);
  });

  // 問題にチェック追加 異常系1
  it('check - NG1', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      format: 'basic',
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.check(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題にチェック外す 正常系1
  it('uncheck - OK', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      format: 'basic',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        result: 'OK',
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.uncheck(req)).toEqual(testResult);
  });

  // 問題にチェック外す 異常系1
  it('uncheck - NG1', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      format: 'basic',
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.uncheck(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 問題のチェック反転 正常系1
  it('reverseCheck - OK', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      format: 'basic',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        checked: true,
      },
    ];
    const result = [
      {
        result: false,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.reverseCheck(req)).toEqual(result);
  });

  // 問題のチェック反転 異常系1
  it('reverseCheck - NG1', async () => {
    // テストデータ
    const req = {
      file_num: 0,
      quiz_num: 0,
      format: 'basic',
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.reverseCheck(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // ファイル追加 正常系1
  it('addFile - OK', async () => {
    // テストデータ
    const req = {
      file_name: 'ファイル名',
      file_nickname: '通称',
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 1,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.addFile(req)).toEqual(testResult);
  });

  // ファイル追加 異常系1
  it('addFile - NG1', async () => {
    // テストデータ
    const req = {
      file_name: 'ファイル名',
      file_nickname: '通称',
    };
    jest.spyOn(Dao, 'execQuery').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.addFile(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // ファイル削除 正常系1
  it('deleteFile - OK', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 1,
      },
    ];
    jest.spyOn(Dao, 'execTransaction').mockResolvedValue(testResult);
    expect(await quizService.deleteFile(req)).toEqual({ result: testResult });
  });

  // ファイル削除 異常系1
  it('deleteFile - NG1', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    jest.spyOn(Dao, 'execTransaction').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(quizService.deleteFile(req)).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });

  // 回答ログ削除 正常系1
  it('deleteAnswerLogByFile - OK', async () => {
    // テストデータ
    const req = {
      file_id: 0,
    };
    // テストデータ 正常時の返り値
    const testResult = [
      {
        file_num: 1,
      },
    ];
    jest.spyOn(Dao, 'execQuery').mockResolvedValue(testResult);
    expect(await quizService.deleteAnswerLogByFile(req)).toEqual({
      result: testResult,
    });
  });
});
