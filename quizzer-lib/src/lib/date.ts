import type { DateUnit } from '../api/quiz/statistics/dto'

// 日付の区切りは実行環境のタイムゾーンで計算する（バックエンドのLambdaはUTCなので日本時間の9時区切り）

// prisma用　大過去・大未来日
export const PAST_DAY = new Date('1980-01-01')
export const FUTURE_DAY = new Date('9999-12-31')

// 今日からn日前の0時0分（nが負ならn日後）
const startOfDaysAgo = (n: number): Date => {
  const nowDate = new Date()
  return new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() - n
  )
}

// 日付をYYYY-MM-DD形式の文字列にする
const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// prisma用 実行時の日の0時0分のDate型データを取得
export const getTodayStart = (): Date => startOfDaysAgo(0)

// prisma用　今日から数えてn日前内のデータを取りたい時の条件
export const getPrismaPastDayRange = (n: number) => ({
  gte: startOfDaysAgo(n),
  lt: startOfDaysAgo(n - 1)
})

// n日前の日付をYYYY-MM-DD形式で取得
export const getPastDate = (n: number): string => toDateKey(startOfDaysAgo(n))

// 今日の日付をYYYY-MM-DD形式で取得
export const getTodayKey = (): string => toDateKey(new Date())

// (回答数統計データ取得APIで利用)始値を計算して取得する
export const getStartDateForStatistics = (
  inputDate: Date,
  date_unit: DateUnit
): Date => {
  switch (date_unit) {
    case 'day': {
      // 入力した日付の00:00:00のデータを返す
      const resetDate = new Date(inputDate)
      resetDate.setHours(0, 0, 0, 0)
      return resetDate
    }
    case 'week': {
      // 入力した日付の週始めの日のデータを返す
      // 週の始まり（月曜日）を計算
      const startOfWeek = new Date(inputDate)
      const day = inputDate.getDay() // 0 (日曜) ～ 6 (土曜)

      // 月曜日にリセットする
      const diffToMonday = (day === 0 ? -6 : 1) - day // 月曜までの日数差
      startOfWeek.setDate(inputDate.getDate() + diffToMonday)

      // 時間を 00:00:00 にリセット
      startOfWeek.setHours(0, 0, 0, 0)
      return startOfWeek
    }
    case 'month': {
      // 入力した日付の月初めの日のデータを返す
      // 月の始まり（1日）を計算
      const startOfMonth = new Date(inputDate)
      startOfMonth.setDate(1) // 1日に設定

      // 時間を 00:00:00 にリセット
      startOfMonth.setHours(0, 0, 0, 0)
      return startOfMonth
    }
    default: {
      // DateUnitに単位を追加してcaseを書き忘れた場合はコンパイルエラーにする
      const unknownUnit: never = date_unit
      return unknownUnit
    }
  }
}
