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
