import { QuizApiResponse, QuizViewApiResponse } from '../../interfaces/db';

// 問題取得系APIの返り値から問題文を生成する
export const generateQuizSentense = (format: string, res: QuizViewApiResponse[]) => {
  if (format === '4choice') {
    const choices = [];
    choices.push(res[0].answer);
    for (let i = 0; i < res.length; i++) {
      choices.push(res[i].dummy_choice_sentense || '');
    }
    // 選択肢の配列をランダムに並び替える
    choices.sort((a, b) => 0.5 - Math.random());

    return `[${res[0].file_num}-${res[0].quiz_num}]${res[0].quiz_sentense}
        A: ${choices[0]}
        B: ${choices[1]}
        C: ${choices[2]}
        D: ${choices[3]}`;
  } else {
    return `[${res[0].file_num}-${res[0].quiz_num}]${res[0].quiz_sentense}`;
  }
};
