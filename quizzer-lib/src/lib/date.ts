// prisma用　大過去・大未来日
export const PAST_DAY = new Date('1980-01-01')
export const FUTURE_DAY = new Date('9999-12-31')

// prisma用 実行時の日の0時0分のDate型データを取得
export const getTodayStart = () => {
  const nowDate = new Date()
  return new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
    0,
    0,
    0
  )
}

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

// prisma用　指定した過去日〜昨日のデータを取りたい時の条件
export const getPrismaFromPastDayRange = (fromDate: Date) => {
  const pastday = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate() - 1,
    0,
    0,
    0
  )
  const nowDate = new Date()
  const today = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
    0,
    0,
    0
  )
  return {
    gte: pastday,
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

// 今日の日付をYYYY-MM-DD形式で取得
export const getTodayKey = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

import type { DateUnit } from '../api/quiz/statistics/dto'

// TODO エラーメッセージを定義する
// (回答数統計データ取得APIで利用)始値を計算して取得する
export const getStartDateForStatistics = (
  inputDate: Date,
  date_unit: DateUnit
) => {
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
    default:
      throw new Error('日付形式が不正です')
  }
}
