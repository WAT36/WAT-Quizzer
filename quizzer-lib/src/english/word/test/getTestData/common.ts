import { EnglishWordTestMeanData, FourChoiceData } from '.'

// TODO これはlibとかに回したい
// 英単語テスト四択APIの返り値から問題文を生成する
export const generateFourChoiceSentense = (res: FourChoiceData) => {
  if (!res.correct || !res.dummy) {
    return []
  }

  const correctIndex = Math.floor(Math.random() * 4)
  const dummyChoice = res.dummy
  // ダミー選択肢の配列をランダムに並び替える
  dummyChoice.sort((a, b) => 0.5 - Math.random())

  const choices = dummyChoice.map((x, i) => ({
    isCorrect: `false${i}`,
    sentense: x.mean
  }))
  choices.splice(correctIndex, 0, {
    isCorrect: 'true',
    sentense: res.correct.mean
  })

  return choices
}
