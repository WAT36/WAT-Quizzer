import { GetQuizApiResponseDto } from '../..'

// ある文字列に 複数の指定された文字のうち 1 つでも含まれているかどうか を判定
export const containsAny = (target: string, chars: string[]): boolean => {
  return chars.some((char) => target.includes(char))
}

// {0},{1},, の箇所に入力した値を代入
export const formatString = (str: string, ...value: string[]) => {
  let result = str
  let i = 0
  while (result.includes(`{${i}}`)) {
    if (value.length > i) {
      result = result.replace(`{${i}}`, value[i])
    } else {
      break
    }
    i++
  }
  return result
}

export const parseStrToBool = (val?: string) => {
  if (!val) {
    return false
  } else if (val.toLowerCase() === 'false' || val.toLowerCase() === 'undefined' || val === '' || val === '0') {
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

export const getDateForSqlString = (date: Date | string) => {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = ('00' + (d.getMonth() + 1)).slice(-2)
  const dd = ('00' + d.getDate()).slice(-2)

  return `${yyyy}-${mm}-${dd}`
}

// 問題取得系APIの返り値から問題文を生成する
export const generateQuizSentense = (
  res: GetQuizApiResponseDto
): Partial<
  Pick<GetQuizApiResponseDto, 'quiz_sentense' | 'answer' | 'quiz_explanation'>
> => {
  // 四択の場合
  if (res.format_id === 3) {
    const choices: string[] = []
    choices.push(res.answer)
    if (res.quiz_dummy_choice) {
      for (let i = 0; i < res.quiz_dummy_choice.length; i++) {
        choices.push(res.quiz_dummy_choice[i].dummy_choice_sentense || '')
      }
    }
    // 選択肢の配列をランダムに並び替える
    // TODO 多肢多答対応で書き換えたがもっと効率化できそうな気する　リファクタしてみて
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const choiceName = alphabets.substring(0, choices.length).split('')
    choiceName.sort((a, b) => 0.5 - Math.random())
    // 答えの文作成
    const answer =
      res.quiz_dummy_choice &&
      res.quiz_dummy_choice.filter((value) => value.is_corrected).length
        ? `${choiceName[0]}${res.quiz_dummy_choice
            .map((value, index) => {
              return value.is_corrected ? ',' + choiceName[index + 1] : ''
            })
            .join('')}`
        : `${choiceName[0]}: ${res.answer.replaceAll('\\n', '\n')}`

    return {
      quiz_sentense:
        res.file_num !== -1 && res.quiz_num !== -1
          ? `[${res.file_num}-${res.quiz_num}]${res.quiz_sentense.replaceAll(
              '\\n',
              '\n'
            )}${
              res.quiz_statistics_view?.accuracy_rate
                ? '(正解率' +
                  Number(res.quiz_statistics_view.accuracy_rate).toFixed(2) +
                  '%)(解答数' +
                  (Number(res.quiz_statistics_view.clear_count ?? 0) + Number(res.quiz_statistics_view.fail_count ?? 0)) +
                  '回)'
                : ''
            }
        ` +
            alphabets
              .substring(0, choices.length)
              .split('')
              .map((value) => {
                return `${value}: ${choices[
                  choiceName.indexOf(value)
                ].replaceAll('\\n', '\n')}
          `
              })
              .join('')
          : '',
      answer,
      quiz_explanation: {
        explanation: res.quiz_explanation
          ? res.quiz_explanation.explanation
              .replaceAll('{c}', choiceName[0])
              .replaceAll('{d1}', choiceName[1])
              .replaceAll('{d2}', choiceName[2])
              .replaceAll('{d3}', choiceName[3])
          : ''
      }
    }
  } else {
    return {
      quiz_sentense:
        res.file_num !== -1 && res.quiz_num !== -1
          ? `[${res.file_num}-${res.quiz_num}]${res.quiz_sentense.replaceAll(
              '\\n',
              '\n'
            )}${
              res.quiz_statistics_view
                ? '(正解率' +
                  Number(
                    res.quiz_statistics_view
                      ? res.quiz_statistics_view.accuracy_rate
                      : NaN
                  ).toFixed(2) +
                  '%)(解答数' +
                  (Number(res.quiz_statistics_view.clear_count ?? 0) + Number(res.quiz_statistics_view.fail_count ?? 0)) +
                  '回)'
                : ''
            }`
          : ''
    }
  }
}
