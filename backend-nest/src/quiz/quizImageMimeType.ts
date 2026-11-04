const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
};

// 問題画像のファイル名からMIMEタイプを返す。不明な拡張子はPNGとして扱う
export const getQuizImageMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  return MIME_TYPE_BY_EXTENSION[extension] ?? 'image/png';
};
