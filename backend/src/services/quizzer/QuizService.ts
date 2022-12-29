import {
  addCategoryToQuiz,
  addQuiz,
  correctRegister,
  deleteQuiz,
  editQuiz,
  getMinimumClearQuiz,
  getQuiz,
  getRandomQuiz,
  getWorstRateQuiz,
  incorrectRegister,
  integrateQuiz,
  searchQuiz
} from './dao/QuizDao'

// ファイル番号、問題番号から問題取得
export const getQuizService = (file_num: number, quiz_num: number) => {
  return new Promise((resolve, reject) => {
    getQuiz(file_num, quiz_num)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// ファイル番号等からランダムに問題取得
export const getRandomQuizService = (
  file_num: number,
  min_rate: number,
  max_rate: number,
  category: string,
  checked: boolean
) => {
  return new Promise((resolve, reject) => {
    getRandomQuiz(file_num, min_rate, max_rate, category, checked)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// ファイル番号等から最低正解率問題取得
export const getWorstRateQuizService = (
  file_num: number,
  category: string,
  checked: boolean
) => {
  return new Promise((resolve, reject) => {
    getWorstRateQuiz(file_num, category, checked)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// ファイル番号等から最小正解数問題取得
export const getMinimumClearQuizService = (
  file_num: number,
  category: string,
  checked: boolean
) => {
  return new Promise((resolve, reject) => {
    getMinimumClearQuiz(file_num, category, checked)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 正解登録
export const correctRegisterService = (file_num: number, quiz_num: number) => {
  return new Promise((resolve, reject) => {
    correctRegister(file_num, quiz_num)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 不正解登録
export const incorrectRegisterService = (
  file_num: number,
  quiz_num: number
) => {
  return new Promise((resolve, reject) => {
    incorrectRegister(file_num, quiz_num)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 問題追加
export const addQuizService = (file_num: number, input_data: string) => {
  return new Promise((resolve, reject) => {
    addQuiz(file_num, input_data)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 問題編集
export const editQuizService = (
  file_num: number,
  quiz_num: number,
  question: string,
  answer: string,
  category: string,
  img_file: string
) => {
  return new Promise((resolve, reject) => {
    editQuiz(file_num, quiz_num, question, answer, category, img_file)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 問題検索
export const searchQuizService = (
  file_num: number,
  min_rate: number,
  max_rate: number,
  category: string,
  checked: boolean,
  query: string,
  cond: any
) => {
  return new Promise((resolve, reject) => {
    searchQuiz(file_num, min_rate, max_rate, category, checked, query, cond)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 問題削除
export const deleteQuizService = (file_num: number, quiz_num: number) => {
  return new Promise((resolve, reject) => {
    deleteQuiz(file_num, quiz_num)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 問題統合
export const integrateQuizService = (
  pre_file_num: number,
  pre_quiz_num: number,
  post_file_num: number,
  post_quiz_num: number
) => {
  return new Promise((resolve, reject) => {
    integrateQuiz(pre_file_num, pre_quiz_num, post_file_num, post_quiz_num)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 問題にカテゴリ追加
export const addCategoryToQuizService = (
  file_num: number,
  quiz_num: number,
  category: string
) => {
  return new Promise((resolve, reject) => {
    addCategoryToQuiz(file_num, quiz_num, category)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
