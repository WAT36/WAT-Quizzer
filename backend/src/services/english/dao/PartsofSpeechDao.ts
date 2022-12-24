import { execQueryForEnglish } from '../../../common/Database'

// SQL
const getPartsofSpeechListSQL = `
    SELECT
        *
    FROM
        partsofspeech
    ORDER BY
        id
    ;
`

// 品詞取得
export const getPartsofSpeech = async () => {
  try {
    let data = await execQueryForEnglish(getPartsofSpeechListSQL, [])
    return data
  } catch (error) {
    throw error
  }
}
