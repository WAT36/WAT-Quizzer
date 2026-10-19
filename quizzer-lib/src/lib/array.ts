// リストからランダムにx個要素を取り出す
export const getRandomElementsFromArray = <T>(arr: T[], n: number) => {
  if (n >= arr.length) {
    return arr
  }

  const extractArr: T[] = []
  const iSet = new Set()
  while (iSet.size < n) {
    const random = Math.floor(Math.random() * arr.length)
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

// 指定インデックスに要素を挿入する関数（長さが足りない場合は拡張する）
export const insertAtArray = <T>(arr: T[], index: number, element: T): T[] => {
  // 必要であれば配列の長さを拡張
  if (index >= arr.length) {
    arr.length = index + 1 // 長さをインデックス+1 まで拡張
  }

  // 指定位置に要素を挿入
  arr[index] = element

  return arr
}
