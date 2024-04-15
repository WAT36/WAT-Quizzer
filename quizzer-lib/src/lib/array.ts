// リストからランダムにx個要素を取り出す
export const getRandomElementsFromArray = (arr: any[], n: number) => {
  if (n >= arr.length) {
    return arr
  }

  const extractArr = []
  const iSet = new Set()
  while (iSet.size < n) {
    let random = Math.floor(Math.random() * arr.length)
    if (iSet.has(random)) {
      continue
    } else {
      extractArr.push(arr[random])
      iSet.add(random)
    }
  }

  return extractArr
}
