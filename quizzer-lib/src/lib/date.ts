// prisma用　昨日内のデータを取りたい時の条件
export const getPrismaYesterdayRange = () => {
  const nowDate = new Date()
  const yesterday = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - 1,
    0,
    0,
    0
  )
  const today = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
    0,
    0,
    0
  )
  return {
    gte: yesterday,
    lt: today
  }
}

// prisma用　今日から数えてn日前内のデータを取りたい時の条件
export const getPrismaPastDayRange = (n: number) => {
  const nowDate = new Date()
  const pastDay = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - n,
    0,
    0,
    0
  )
  const pastDayTommorow = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - n + 1,
    0,
    0,
    0
  )
  return {
    gte: pastDay,
    lt: pastDayTommorow
  }
}

// Date型 n日前の日付形式を(文字列形式で)取得
export const getPastDate = (n: number) => {
  const nowDate = new Date()
  const pastDay = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - n,
    0,
    0,
    0
  )
  return pastDay
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .replaceAll('/', '-')
}
