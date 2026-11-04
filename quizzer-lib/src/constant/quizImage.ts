// 問題画像アップロードの制限
export const QUIZ_IMAGE_LIMITS = {
  MAX_FILE_SIZE_MB: 5,
  // 画像取得API(/quiz/image)が返せる形式に合わせている
  MIME_TYPES: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif']
}
