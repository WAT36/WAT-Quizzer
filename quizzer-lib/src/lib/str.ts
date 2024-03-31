import { GetQuizApiResponseDto } from '../..'

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
  res: GetQuizApiResponseDto[]
) => {
  if (format === '4choice') {
    const choices = []
    choices.push(res[0].answer)
    for (let i = 0; i < res.length; i++) {
      choices.push(res[i].dummy_choice_sentense || '')
    }
    // 選択肢の配列をランダムに並び替える
    const choiceName = ['A', 'B', 'C', 'D']
    choiceName.sort((a, b) => 0.5 - Math.random())

    return {
      quizSentense: `[${res[0].file_num}-${res[0].quiz_num}]${
        res[0].quiz_sentense
      }${
        res[0].accuracy_rate
          ? '(正解率' + Number(res[0].accuracy_rate).toFixed(2) + '%)'
          : ''
      }
        A: ${choices[choiceName.indexOf('A')]}
        B: ${choices[choiceName.indexOf('B')]}
        C: ${choices[choiceName.indexOf('C')]}
        D: ${choices[choiceName.indexOf('D')]}`,
      quizAnswer: `${choiceName[0]}: ${res[0].answer}`,
      explanation: res[0].explanation
        ? res[0].explanation
            .replaceAll('{c}', choiceName[0])
            .replaceAll('{d1}', choiceName[1])
            .replaceAll('{d2}', choiceName[2])
            .replaceAll('{d3}', choiceName[3])
        : ''
    }
  } else {
    return {
      quizSentense: `[${res[0].file_num}-${res[0].quiz_num}]${
        res[0].quiz_sentense
      }${
        res[0].accuracy_rate
          ? '(正解率' + Number(res[0].accuracy_rate).toFixed(2) + '%)'
          : ''
      }`,
      quizAnswer: res[0].answer,
      explanation: res[0].explanation
    }
  }
}
