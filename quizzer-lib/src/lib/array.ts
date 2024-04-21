// リストからランダムにx個要素を取り出す
export const getRandomElementsFromArray = <T>(arr: T[], n: number) => {
  if (n >= arr.length) {
    return arr
  }

  const extractArr: T[] = []
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

// リストからランダムに1個要素を取り出す
export const getRandomElementFromArray = <T>(arr: T[]) => {
  if (arr.length === 0) {
    return
  }
  const random = Math.floor(Math.random() * arr.length)
  return arr[random]
}
