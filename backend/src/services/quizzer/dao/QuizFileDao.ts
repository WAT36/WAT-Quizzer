import { execQuery } from '../../../common/Database'

// SQL
const getFileListSQL = `
    SELECT
        *
    FROM
        quiz_file
    ORDER BY
        file_num;
`

// 問題ファイルリスト取得
export const getFileList = async () => {
  try {
    let data = await execQuery(getFileListSQL, [])
    return data
  } catch (error) {
    throw error
  }
}
