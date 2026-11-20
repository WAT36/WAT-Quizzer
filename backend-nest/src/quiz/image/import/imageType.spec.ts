import { detectImageType } from './imageType';

const bytes = (...parts: (number[] | string)[]) =>
  Buffer.concat(
    parts.map((p) =>
      typeof p === 'string' ? Buffer.from(p, 'latin1') : Buffer.from(p),
    ),
  );

describe('detectImageType', () => {
  it.each([
    [
      'PNG',
      bytes([0x89], 'PNG', [0x0d, 0x0a, 0x1a, 0x0a, 0]),
      'png',
      'image/png',
    ],
    ['JPEG', bytes([0xff, 0xd8, 0xff, 0xe0]), 'jpg', 'image/jpeg'],
    ['GIF89a', bytes('GIF89a', [0]), 'gif', 'image/gif'],
    ['GIF87a', bytes('GIF87a'), 'gif', 'image/gif'],
    ['WebP', bytes('RIFF', [0, 0, 0, 0], 'WEBPVP8 '), 'webp', 'image/webp'],
    ['AVIF', bytes([0, 0, 0, 0x1c], 'ftypavif'), 'avif', 'image/avif'],
  ])('%sを判定する', (_, buf, extension, mimeType) => {
    expect(detectImageType(buf)).toEqual({ extension, mimeType });
  });

  it.each([
    ['HTML', bytes('<!doctype html><html>')],
    ['SVG', bytes('<svg xmlns="http://www.w3.org/2000/svg">')],
    ['空', bytes()],
    ['PNGの途中まで', bytes([0x89], 'PNG')],
    ['RIFFだがWebPでない', bytes('RIFF', [0, 0, 0, 0], 'WAVE')],
    ['ftypだがAVIFでない', bytes([0, 0, 0, 0x18], 'ftypmp42')],
  ])('%sは画像として扱わない', (_, buf) => {
    expect(detectImageType(buf)).toBeNull();
  });
});
