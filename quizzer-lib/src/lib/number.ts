// 0~入力した整数未満 の範囲内の整数をランダムで取得
export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}
