const testCommon = require('./TestCommon');
const addQuiz = require('../services/QuizService').addQuiz;


// 何かひとつ問題を追加する
test('Add 1 Quiz.',() => {
    // まず全消し
    testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    addQuiz(0,"addQuizテスト問題,addQuizテスト答え,addQuizテストカテゴリ,addQuizテスト画像");

    // 問題取得
    let data = testCommon.getAllQuizOfFileService(0);
    console.log("datatest:",data)
    // 確認
    expect(data.length).toBe(1);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題');
    expect(data[0].answer).toBe('addQuizテスト答え');
    expect(data[0].category).toBe('addQuizテストカテゴリ');
    expect(data[0].img_file).toBe('addQuizテスト画像');
});
