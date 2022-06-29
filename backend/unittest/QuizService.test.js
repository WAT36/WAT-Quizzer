require('iconv-lite').encodingExists('foo');

const testCommon = require('./TestCommon');
const QuizService = require('../services/QuizService');

// 何かひとつ問題を追加するテスト
test('Add 1 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,"addQuizテスト問題,addQuizテスト答え,addQuizテストカテゴリ,addQuizテスト画像");

    // 問題取得
    let data = await testCommon.getAllQuizOfFileService(0);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題');
    expect(data[0].answer).toBe('addQuizテスト答え');
    expect(data[0].category).toBe('addQuizテストカテゴリ');
    expect(data[0].img_file).toBe('addQuizテスト画像');
});

// 問題を取得するテスト
test('Get 1 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,"getQuizテスト問題,getQuizテスト答え,getQuizテストカテゴリ,getQuizテスト画像");

    // 問題取得
    let data = await QuizService.getQuiz(0,1);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].quiz_sentense).toBe('getQuizテスト問題');
    expect(data[0].answer).toBe('getQuizテスト答え');
    expect(data[0].category).toBe('getQuizテストカテゴリ');
    expect(data[0].img_file).toBe('getQuizテスト画像');
});