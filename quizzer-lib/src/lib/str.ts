import { GetQuizApiResponseDto } from '../..'

export const parseStrToBool = (val: string) => {
  if (!val) {
    return false
  } else if (val.toLowerCase() === 'false' || val === '' || val === '0') {
    return false
  }

  return true
}

export const getRandomStr = () => {
  let chars = 'abcdefghijklmnopqrstuvwxyz'
  let rand_str = ''
  for (var i = 0; i < 8; i++) {
    rand_str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return rand_str
}

export const getDateForSqlString = (date: Date) => {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = ('00' + (d.getMonth() + 1)).slice(-2)
  const dd = ('00' + d.getDate()).slice(-2)

  return `${yyyy}-${mm}-${dd}`
}

// 問題取得系APIの返り値から問題文を生成する
export const generateQuizSentense = (
  format: string,
  res: GetQuizApiResponseDto
) => {
  if (format === '4choice') {
    const choices = []
    choices.push(res.answer)
    if (res.dummy_choice) {
      for (let i = 0; i < res.dummy_choice.length; i++) {
        choices.push(res.dummy_choice[i].dummy_choice_sentense || '')
      }
    }
    // 選択肢の配列をランダムに並び替える
    const choiceName = ['A', 'B', 'C', 'D']
    choiceName.sort((a, b) => 0.5 - Math.random())

    return {
      quizSentense: `[${res.file_num}-${res.quiz_num}]${res.quiz_sentense}${
        res.advanced_quiz_statistics_view?.accuracy_rate
          ? '(正解率' +
            Number(res.advanced_quiz_statistics_view.accuracy_rate).toFixed(2) +
            '%)'
          : ''
      }
        A: ${choices[choiceName.indexOf('A')]}
        B: ${choices[choiceName.indexOf('B')]}
        C: ${choices[choiceName.indexOf('C')]}
        D: ${choices[choiceName.indexOf('D')]}`,
      quizAnswer: `${choiceName[0]}: ${res.answer}`,
      explanation: res.advanced_quiz_explanation
        ? res.advanced_quiz_explanation.explanation
            .replaceAll('{c}', choiceName[0])
            .replaceAll('{d1}', choiceName[1])
            .replaceAll('{d2}', choiceName[2])
            .replaceAll('{d3}', choiceName[3])
        : ''
    }
  } else {
    return {
      quizSentense: `[${res.file_num}-${res.quiz_num}]${res.quiz_sentense}${
        res.quiz_statistics_view
          ? '(正解率' +
            Number(
              res.quiz_statistics_view
                ? res.quiz_statistics_view.accuracy_rate
                : res.advanced_quiz_statistics_view
                ? res.advanced_quiz_statistics_view.accuracy_rate
                : NaN
            ).toFixed(2) +
            '%)'
          : ''
      }`,
      quizAnswer: res.answer,
      explanation: res.advanced_quiz_explanation
        ? res.advanced_quiz_explanation.explanation
        : '(なし)'
    }
  }
}
