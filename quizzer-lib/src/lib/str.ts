import type { GetQuizApiResponseDto } from '../..'
import { shuffleArray } from './array'

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

// クエリなどの文字列を真偽値にする（空・'false'・'undefined'・'0'はfalse）
export const parseStrToBool = (val?: string): boolean =>
  !!val && !['false', 'undefined', '0'].includes(val.toLowerCase())

export const getRandomStr = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let rand_str = ''
  for (let i = 0; i < 8; i++) {
    rand_str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return rand_str
}

// 問題画面に表示する問題文・答え・解説
export interface GeneratedQuizSentense {
  quiz_sentense: string
  // 四択の時だけ、選択肢の記号を使った答えと解説を返す
  answer?: string
  quiz_explanation?: {
    explanation: string
  }
}

const CHOICE_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// APIの問題文などに含まれる文字列の"\n"を改行にする
const toNewLine = (str: string) => str.replaceAll('\\n', '\n')

// [ファイル番号-問題番号]問題文(正解率XX.XX%)(解答数N回)
const quizHeader = (res: GetQuizApiResponseDto): string => {
  const stats = res.quiz_statistics_view
  const statsText = stats
    ? `(正解率${Number(stats.accuracy_rate).toFixed(2)}%)(解答数${
        Number(stats.clear_count ?? 0) + Number(stats.fail_count ?? 0)
      }回)`
    : ''
  const sentense = toNewLine(res.quiz_sentense)
  return `[${res.file_num}-${res.quiz_num}]${sentense}${statsText}`
}

// 問題取得系APIの返り値から問題文を生成する
export const generateQuizSentense = (
  res: GetQuizApiResponseDto
): GeneratedQuizSentense => {
  const hasQuiz = res.file_num !== -1 && res.quiz_num !== -1
  if (res.format_id !== 3) {
    return { quiz_sentense: hasQuiz ? quizHeader(res) : '' }
  }

  // 四択: 正解(index 0)とダミー選択肢(index 1〜)をランダムに並べ、並んだ順にA,B,C,,を振る
  const dummies = res.quiz_dummy_choice ?? []
  const choices = [
    { index: 0, sentense: res.answer, isCorrect: true },
    ...dummies.map((x, i) => ({
      index: i + 1,
      sentense: x.dummy_choice_sentense || '',
      isCorrect: x.is_corrected
    }))
  ]
  const shuffled = shuffleArray(choices)
  // labels[index] = 元の選択肢(0:正解, 1〜:ダミー)に振られた記号
  const labels: string[] = []
  shuffled.forEach((choice, position) => {
    labels[choice.index] = CHOICE_LABELS[position]
  })

  // 多答(正解になるダミーがある)なら記号だけを並べ、そうでなければ記号と正解の文
  const isMultipleAnswer = dummies.some((x) => x.is_corrected)
  const answer = isMultipleAnswer
    ? choices
        .filter((choice) => choice.isCorrect)
        .map((choice) => labels[choice.index])
        .join(',')
    : `${labels[0]}: ${toNewLine(res.answer)}`

  // 解説の{c}は正解、{d1},{d2},,はダミー選択肢の記号に置き換える
  const explanation = dummies.reduce(
    (text, _x, i) => text.replaceAll(`{d${i + 1}}`, labels[i + 1]),
    (res.quiz_explanation?.explanation ?? '').replaceAll('{c}', labels[0])
  )

  return {
    quiz_sentense: hasQuiz
      ? `${quizHeader(res)}\n` +
        shuffled
          .map(
            (choice, position) =>
              `${CHOICE_LABELS[position]}: ${toNewLine(choice.sentense)}\n`
          )
          .join('')
      : '',
    answer,
    quiz_explanation: { explanation }
  }
}
