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
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(1);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題');
    expect(data[0].answer).toBe('addQuizテスト答え');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('addQuizテストカテゴリ');
    expect(data[0].img_file).toBe('addQuizテスト画像');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

let add_fivequizs = `addQuizテスト問題1,addQuizテスト答え1,addQuizテストカテゴリ1,addQuizテスト画像1
addQuizテスト問題2,addQuizテスト答え2,addQuizテストカテゴリ2,addQuizテスト画像2
addQuizテスト問題3,addQuizテスト答え3,addQuizテストカテゴリ3,addQuizテスト画像3
addQuizテスト問題4,addQuizテスト答え4,addQuizテストカテゴリ4,addQuizテスト画像4
addQuizテスト問題5,addQuizテスト答え5,addQuizテストカテゴリ5,addQuizテスト画像5`;

// 5つ問題を追加するテスト
test('Add 5 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 問題取得
    let data = await testCommon.getAllQuizOfFileService(0);

    // 確認
    expect(data.length).toBe(5);
    for(var i=0;i<data.length;i++){
        expect(data[i].file_num).toBe(0);
        expect(data[i].quiz_num).toBe(i+1);    
        expect(data[i].quiz_sentense).toBe('addQuizテスト問題'+(i+1));
        expect(data[i].answer).toBe('addQuizテスト答え'+(i+1));
        expect(data[i].clear_count).toBe(0);
        expect(data[i].fail_count).toBe(0);
        expect(data[i].category).toBe('addQuizテストカテゴリ'+(i+1));
        expect(data[i].img_file).toBe('addQuizテスト画像'+(i+1));
        expect(data[i].checked).toBe(0);
        expect(data[i].deleted).toBe(0);
    }
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
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(1);
    expect(data[0].quiz_sentense).toBe('getQuizテスト問題');
    expect(data[0].answer).toBe('getQuizテスト答え');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('getQuizテストカテゴリ');
    expect(data[0].img_file).toBe('getQuizテスト画像');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// 1つの問題からランダムに問題を取得するテスト
test('Random Get 1 of 1 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,"getQuizテスト問題,getQuizテスト答え,getQuizテストカテゴリ,getQuizテスト画像");

    // 問題取得
    let data = await QuizService.getRandomQuiz(0,0,100,null,false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(1);
    expect(data[0].quiz_sentense).toBe('getQuizテスト問題');
    expect(data[0].answer).toBe('getQuizテスト答え');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('getQuizテストカテゴリ');
    expect(data[0].img_file).toBe('getQuizテスト画像');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// 5つの問題からランダムに問題を取得するテスト
test('Random Get 1 of 5 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 問題取得
    let data = await QuizService.getRandomQuiz(0,0,100,null,false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    // expect(data[0].quiz_num).toBe(1);
    // expect(data[0].quiz_sentense).toBe('addQuizテスト問題');
    // expect(data[0].answer).toBe('addQuizテスト答え');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    // expect(data[0].category).toBe('addQuizテストカテゴリ');
    // expect(data[0].img_file).toBe('addQuizテスト画像');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// 5つの問題からランダムに問題を取得するテスト
test('Random Get 1 of 5 Quiz by accuracy_rate.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解率操作
    result = await testCommon.updateAnswerNumOfQuiz(0,10,0,1);//0%
    result = await testCommon.updateAnswerNumOfQuiz(2,8,0,2);//20%
    result = await testCommon.updateAnswerNumOfQuiz(4,6,0,3);//40%
    result = await testCommon.updateAnswerNumOfQuiz(6,4,0,4);//60%
    result = await testCommon.updateAnswerNumOfQuiz(8,2,0,5);//80%

    // 問題取得(正解率40%のみ)
    let data = await QuizService.getRandomQuiz(0,40,40,null,false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(3);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題3');
    expect(data[0].answer).toBe('addQuizテスト答え3');
    expect(data[0].clear_count).toBe(4);
    expect(data[0].fail_count).toBe(6);
    expect(data[0].category).toBe('addQuizテストカテゴリ3');
    expect(data[0].img_file).toBe('addQuizテスト画像3');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// ランダム取得でチェック済だけ取ってくるテスト
test('Random Get 1 of 5 Quiz of checked.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // チェック済(4番目をチェック)
    result = await testCommon.doCheckQuiz(0,4);

    // 問題取得(チェック済のみ)
    let data = await QuizService.getRandomQuiz(0,0,100,null,true);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(4);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題4');
    expect(data[0].answer).toBe('addQuizテスト答え4');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('addQuizテストカテゴリ4');
    expect(data[0].img_file).toBe('addQuizテスト画像4');
    expect(data[0].checked).toBe(1); //チェック済
    expect(data[0].deleted).toBe(0);
});

// ランダム取得で指定カテゴリの問題だけ取ってくるテスト
test('Random Get 1 of 5 Quiz by category.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // カテゴリ
    result = await testCommon.updateCategoryOfQuiz("カテゴリ1:カテゴリ2:カテゴリ3",0,1)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ4:カテゴリ5:カテゴリ6",0,2)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ7:カテゴリ8:カテゴリ9",0,3)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ10:カテゴリ11:カテゴリ12",0,4)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ13:カテゴリ14:カテゴリ15",0,5)

    // 問題取得(カテゴリ5のみ)
    let data = await QuizService.getRandomQuiz(0,0,100,"カテゴリ5",false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(2);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題2');
    expect(data[0].answer).toBe('addQuizテスト答え2');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('カテゴリ4:カテゴリ5:カテゴリ6');
    expect(data[0].img_file).toBe('addQuizテスト画像2');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// ランダム取得 指定正解率範囲×チェック済
test('Random Get 1 of 5 Quiz by rate and checked.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解率
    result = await testCommon.updateAnswerNumOfQuiz(0,10,0,1);//0%
    result = await testCommon.updateAnswerNumOfQuiz(2,8,0,2);//20%
    result = await testCommon.updateAnswerNumOfQuiz(4,6,0,3);//40%
    result = await testCommon.updateAnswerNumOfQuiz(6,4,0,4);//60%
    result = await testCommon.updateAnswerNumOfQuiz(8,2,0,5);//80%

    // チェック済(1,4番目をチェック)
    result = await testCommon.doCheckQuiz(0,1);
    result = await testCommon.doCheckQuiz(0,4);

    // 問題取得(20~100%,チェック済->4のみ)
    let data = await QuizService.getRandomQuiz(0,20,100,null,true);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(4);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題4');
    expect(data[0].answer).toBe('addQuizテスト答え4');
    expect(data[0].clear_count).toBe(6);
    expect(data[0].fail_count).toBe(4);
    expect(data[0].category).toBe('addQuizテストカテゴリ4');
    expect(data[0].img_file).toBe('addQuizテスト画像4');
    expect(data[0].checked).toBe(1);
    expect(data[0].deleted).toBe(0);
});

// ランダム取得 指定正解率範囲×指定カテゴリ
test('Random Get 1 of 5 Quiz by rate and category.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解率
    result = await testCommon.updateAnswerNumOfQuiz(0,10,0,1);//0%
    result = await testCommon.updateAnswerNumOfQuiz(2,8,0,2);//20%
    result = await testCommon.updateAnswerNumOfQuiz(4,6,0,3);//40%
    result = await testCommon.updateAnswerNumOfQuiz(6,4,0,4);//60%
    result = await testCommon.updateAnswerNumOfQuiz(8,2,0,5);//80%

    // カテゴリ
    result = await testCommon.updateCategoryOfQuiz("カテゴリ0:カテゴリ1",0,1)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ0:カテゴリ1",0,2)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ1:カテゴリ2",0,3)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ1:カテゴリ2",0,4)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ2:カテゴリ3",0,5)

    // 問題取得(0~50%,カテゴリ2->3のみ)
    let data = await QuizService.getRandomQuiz(0,0,50,"カテゴリ2",false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(3);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題3');
    expect(data[0].answer).toBe('addQuizテスト答え3');
    expect(data[0].clear_count).toBe(4);
    expect(data[0].fail_count).toBe(6);
    expect(data[0].category).toBe('カテゴリ1:カテゴリ2');
    expect(data[0].img_file).toBe('addQuizテスト画像3');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// ランダム取得 指定カテゴリ×チェック
test('Random Get 1 of 5 Quiz by rate and category.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // カテゴリ
    result = await testCommon.updateCategoryOfQuiz("カテゴリ0:カテゴリ1",0,1)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ0:カテゴリ1",0,2)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ1:カテゴリ2",0,3)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ1:カテゴリ2",0,4)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ2:カテゴリ3",0,5)

    // チェック済(1,4番目をチェック)
    result = await testCommon.doCheckQuiz(0,1);
    result = await testCommon.doCheckQuiz(0,4);
    
    // 問題取得(カテゴリ2,チェック済->4のみ)
    let data = await QuizService.getRandomQuiz(0,0,100,"カテゴリ2",true);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(4);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題4');
    expect(data[0].answer).toBe('addQuizテスト答え4');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('カテゴリ1:カテゴリ2');
    expect(data[0].img_file).toBe('addQuizテスト画像4');
    expect(data[0].checked).toBe(1);
    expect(data[0].deleted).toBe(0);
});

// ランダム取得 正解率×カテゴリ×チェック
test('Random Get 1 of 5 Quiz by rate and category and checked.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解率
    result = await testCommon.updateAnswerNumOfQuiz(0,10,0,1);//0%
    result = await testCommon.updateAnswerNumOfQuiz(2,8,0,2);//20%
    result = await testCommon.updateAnswerNumOfQuiz(4,6,0,3);//40%
    result = await testCommon.updateAnswerNumOfQuiz(6,4,0,4);//60%
    result = await testCommon.updateAnswerNumOfQuiz(8,2,0,5);//80%
    
    // カテゴリ
    result = await testCommon.updateCategoryOfQuiz("カテゴリ0:カテゴリ1",0,1)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ0:カテゴリ1",0,2)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ1:カテゴリ2",0,3)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ1:カテゴリ2",0,4)
    result = await testCommon.updateCategoryOfQuiz("カテゴリ2:カテゴリ3",0,5)

    // チェック済(1,4番目をチェック)
    result = await testCommon.doCheckQuiz(0,1);
    result = await testCommon.doCheckQuiz(0,4);
    
    // 問題取得(0~50%,カテゴリ1,チェック済->4のみ)
    let data = await QuizService.getRandomQuiz(0,0,50,"カテゴリ1",true);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(1);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題1');
    expect(data[0].answer).toBe('addQuizテスト答え1');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(10);
    expect(data[0].category).toBe('カテゴリ0:カテゴリ1');
    expect(data[0].img_file).toBe('addQuizテスト画像1');
    expect(data[0].checked).toBe(1);
    expect(data[0].deleted).toBe(0);
});

// 最低正解率取得
test('Worst Rate of 5 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解率
    result = await testCommon.updateAnswerNumOfQuiz(200,800,0,1);//20%
    result = await testCommon.updateAnswerNumOfQuiz(4,6,0,2);//40%
    result = await testCommon.updateAnswerNumOfQuiz(6,4,0,3);//60%
    result = await testCommon.updateAnswerNumOfQuiz(8,2,0,4);//80%
    result = await testCommon.updateAnswerNumOfQuiz(1,0,0,5);//100%
    
    // 最低正解率問題取得
    let data = await QuizService.getWorstRateQuiz(0,null,false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(1);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題1');
    expect(data[0].answer).toBe('addQuizテスト答え1');
    expect(data[0].clear_count).toBe(200);
    expect(data[0].fail_count).toBe(800);
    expect(data[0].category).toBe('addQuizテストカテゴリ1');
    expect(data[0].img_file).toBe('addQuizテスト画像1');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// (チェック済の)最低正解率取得
test('Worst Rate of 5 Quiz and checked.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解率
    result = await testCommon.updateAnswerNumOfQuiz(200,800,0,1);//20%
    result = await testCommon.updateAnswerNumOfQuiz(4,6,0,2);//40%
    result = await testCommon.updateAnswerNumOfQuiz(6,4,0,3);//60%
    result = await testCommon.updateAnswerNumOfQuiz(8,2,0,4);//80%
    result = await testCommon.updateAnswerNumOfQuiz(1,0,0,5);//100%

    // チェック済(4番目をチェック)
    result = await testCommon.doCheckQuiz(0,4);
    
    // 最低正解率問題取得
    let data = await QuizService.getWorstRateQuiz(0,null,true);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(4);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題4');
    expect(data[0].answer).toBe('addQuizテスト答え4');
    expect(data[0].clear_count).toBe(8);
    expect(data[0].fail_count).toBe(2);
    expect(data[0].category).toBe('addQuizテストカテゴリ4');
    expect(data[0].img_file).toBe('addQuizテスト画像4');
    expect(data[0].checked).toBe(1);
    expect(data[0].deleted).toBe(0);
});


// (指定カテゴリの)最低正解率取得
test('Worst Rate of 5 Quiz and category.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解率
    result = await testCommon.updateAnswerNumOfQuiz(200,800,0,1);//20%
    result = await testCommon.updateAnswerNumOfQuiz(4,6,0,2);//40%
    result = await testCommon.updateAnswerNumOfQuiz(6,4,0,3);//60%
    result = await testCommon.updateAnswerNumOfQuiz(8,2,0,4);//80%
    result = await testCommon.updateAnswerNumOfQuiz(1,0,0,5);//100%

    // カテゴリ
    result = await testCommon.updateCategoryOfQuiz("カテゴリA:カテゴリB",0,2)
    result = await testCommon.updateCategoryOfQuiz("カテゴリB:カテゴリC",0,3)
    result = await testCommon.updateCategoryOfQuiz("カテゴリB:カテゴリC",0,4)
    
    // 最低正解率問題取得
    let data = await QuizService.getWorstRateQuiz(0,'カテゴリB',false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(2);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題2');
    expect(data[0].answer).toBe('addQuizテスト答え2');
    expect(data[0].clear_count).toBe(4);
    expect(data[0].fail_count).toBe(6);
    expect(data[0].category).toBe('カテゴリA:カテゴリB');
    expect(data[0].img_file).toBe('addQuizテスト画像2');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// (指定カテゴリの)最低正解率取得
test('Worst Rate of 5 Quiz and category and checked.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解率
    result = await testCommon.updateAnswerNumOfQuiz(200,800,0,1);//20%
    result = await testCommon.updateAnswerNumOfQuiz(4,6,0,2);//40%
    result = await testCommon.updateAnswerNumOfQuiz(6,4,0,3);//60%
    result = await testCommon.updateAnswerNumOfQuiz(8,2,0,4);//80%
    result = await testCommon.updateAnswerNumOfQuiz(1,0,0,5);//100%

    // カテゴリ
    result = await testCommon.updateCategoryOfQuiz("カテゴリA:カテゴリB",0,2)
    result = await testCommon.updateCategoryOfQuiz("カテゴリB:カテゴリC",0,3)
    result = await testCommon.updateCategoryOfQuiz("カテゴリB:カテゴリC",0,4)
    
    // チェック済(4番目をチェック)
    result = await testCommon.doCheckQuiz(0,3);

    // 最低正解率問題取得
    let data = await QuizService.getWorstRateQuiz(0,'カテゴリB',true);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(3);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題3');
    expect(data[0].answer).toBe('addQuizテスト答え3');
    expect(data[0].clear_count).toBe(6);
    expect(data[0].fail_count).toBe(4);
    expect(data[0].category).toBe('カテゴリB:カテゴリC');
    expect(data[0].img_file).toBe('addQuizテスト画像3');
    expect(data[0].checked).toBe(1);
    expect(data[0].deleted).toBe(0);
});

// 最小正解数取得
test('Minimum Clear of 5 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解数
    result = await testCommon.updateAnswerNumOfQuiz(200,800,0,1);//20%
    result = await testCommon.updateAnswerNumOfQuiz(40,60,0,2);//40%
    result = await testCommon.updateAnswerNumOfQuiz(30,20,0,3);//60%
    result = await testCommon.updateAnswerNumOfQuiz(16,4,0,4);//80%
    result = await testCommon.updateAnswerNumOfQuiz(1,0,0,5);//100%
    
    // 最小正解数問題取得
    let data = await QuizService.getMinimumClearQuiz(0,null,false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(5);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題5');
    expect(data[0].answer).toBe('addQuizテスト答え5');
    expect(data[0].clear_count).toBe(1);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('addQuizテストカテゴリ5');
    expect(data[0].img_file).toBe('addQuizテスト画像5');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// 最小正解数取得　チェック込み
test('Minimum Clear of 5 Quiz and checked.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解数
    result = await testCommon.updateAnswerNumOfQuiz(200,800,0,1);//20%
    result = await testCommon.updateAnswerNumOfQuiz(40,60,0,2);//40%
    result = await testCommon.updateAnswerNumOfQuiz(30,20,0,3);//60%
    result = await testCommon.updateAnswerNumOfQuiz(16,4,0,4);//80%
    result = await testCommon.updateAnswerNumOfQuiz(1,0,0,5);//100%

    // チェック済(4番目をチェック)
    result = await testCommon.doCheckQuiz(0,3);
    result = await testCommon.doCheckQuiz(0,4);
    
    // 最小正解数問題取得
    let data = await QuizService.getMinimumClearQuiz(0,null,true);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(4);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題4');
    expect(data[0].answer).toBe('addQuizテスト答え4');
    expect(data[0].clear_count).toBe(16);
    expect(data[0].fail_count).toBe(4);
    expect(data[0].category).toBe('addQuizテストカテゴリ4');
    expect(data[0].img_file).toBe('addQuizテスト画像4');
    expect(data[0].checked).toBe(1);
    expect(data[0].deleted).toBe(0);
});

// 最小正解数取得　指定カテゴリ・チェック込み
test('Minimum Clear of 5 Quiz and category.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 正解数
    result = await testCommon.updateAnswerNumOfQuiz(200,800,0,1);//20%
    result = await testCommon.updateAnswerNumOfQuiz(40,60,0,2);//40%
    result = await testCommon.updateAnswerNumOfQuiz(30,20,0,3);//60%
    result = await testCommon.updateAnswerNumOfQuiz(16,4,0,4);//80%
    result = await testCommon.updateAnswerNumOfQuiz(1,0,0,5);//100%
    
    // カテゴリ
    result = await testCommon.updateCategoryOfQuiz("カテゴリA:カテゴリB",0,2)
    result = await testCommon.updateCategoryOfQuiz("カテゴリB:カテゴリC",0,3)
    result = await testCommon.updateCategoryOfQuiz("カテゴリB:カテゴリC",0,4)

    // チェック
    result = await testCommon.doCheckQuiz(0,2);
    result = await testCommon.doCheckQuiz(0,3);

    // 最小正解数問題取得
    let data = await QuizService.getMinimumClearQuiz(0,"カテゴリA",true);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(2);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題2');
    expect(data[0].answer).toBe('addQuizテスト答え2');
    expect(data[0].clear_count).toBe(40);
    expect(data[0].fail_count).toBe(60);
    expect(data[0].category).toBe('カテゴリA:カテゴリB');
    expect(data[0].img_file).toBe('addQuizテスト画像2');
    expect(data[0].checked).toBe(1);
    expect(data[0].deleted).toBe(0);
});