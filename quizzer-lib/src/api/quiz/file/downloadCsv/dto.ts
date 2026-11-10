// 問題ファイルCSVダウンロードAPIリクエスト型
export interface DownloadQuizCsvAPIRequestDto {
  file_num: number
}

// 問題ファイルCSVダウンロードAPIの結果（CSVの本文）
export interface DownloadQuizCsvResult {
  csv: string
}
