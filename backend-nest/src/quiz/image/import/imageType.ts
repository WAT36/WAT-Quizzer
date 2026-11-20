// 先頭バイトから画像の形式を判定する
// Content-Typeや拡張子は信用できない（画像のURLでもHTMLのエラーページが返ることがある）ため、中身で判定する
// 対応形式は手動アップロードと同じ（QUIZ_IMAGE_LIMITS.MIME_TYPES）。SVGはスクリプトを含められるので扱わない

export interface DetectedImageType {
  extension: 'png' | 'jpg' | 'gif' | 'webp' | 'avif';
  mimeType: string;
}

const ascii = (buf: Buffer, start: number, end: number) =>
  buf.subarray(start, end).toString('latin1');

export const detectImageType = (buf: Buffer): DetectedImageType | null => {
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    ascii(buf, 1, 4) === 'PNG' &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return { extension: 'png', mimeType: 'image/png' };
  }
  if (
    buf.length >= 3 &&
    buf[0] === 0xff &&
    buf[1] === 0xd8 &&
    buf[2] === 0xff
  ) {
    return { extension: 'jpg', mimeType: 'image/jpeg' };
  }
  if (buf.length >= 6 && ['GIF87a', 'GIF89a'].includes(ascii(buf, 0, 6))) {
    return { extension: 'gif', mimeType: 'image/gif' };
  }
  if (
    buf.length >= 12 &&
    ascii(buf, 0, 4) === 'RIFF' &&
    ascii(buf, 8, 12) === 'WEBP'
  ) {
    return { extension: 'webp', mimeType: 'image/webp' };
  }
  if (
    buf.length >= 12 &&
    ascii(buf, 4, 8) === 'ftyp' &&
    ['avif', 'avis'].includes(ascii(buf, 8, 12))
  ) {
    return { extension: 'avif', mimeType: 'image/avif' };
  }
  return null;
};
