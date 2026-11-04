import { getQuizImageMimeType } from './quizImageMimeType';

describe('getQuizImageMimeType', () => {
  it.each([
    ['a.png', 'image/png'],
    ['a.jpg', 'image/jpeg'],
    ['a.jpeg', 'image/jpeg'],
    ['a.gif', 'image/gif'],
    ['a.webp', 'image/webp'],
    ['a.avif', 'image/avif'],
    ['A.WEBP', 'image/webp'],
    ['a.b.avif', 'image/avif'],
  ])('%sは%sになる', (fileName, mimeType) => {
    expect(getQuizImageMimeType(fileName)).toBe(mimeType);
  });

  it('不明な拡張子はPNGとして扱う', () => {
    expect(getQuizImageMimeType('a.bmp')).toBe('image/png');
    expect(getQuizImageMimeType('a')).toBe('image/png');
  });
});
