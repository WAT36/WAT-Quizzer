import {
  CANDIDATE_SIGNATURE_VALID_MS,
  signImageCandidate,
  verifyImageCandidate,
} from './candidateSignature';

describe('candidateSignature', () => {
  const target = {
    quizId: 1,
    imageUrl: 'https://a.example/x.jpg',
    thumbnailUrl: 'https://a.example/t.jpg',
  };
  const now = 1_700_000_000_000;
  const original = process.env.QUIZ_IMAGE_SIGNING_SECRET;

  beforeEach(() => {
    process.env.QUIZ_IMAGE_SIGNING_SECRET = 'test-secret';
  });
  afterAll(() => {
    process.env.QUIZ_IMAGE_SIGNING_SECRET = original;
  });

  it('付けた署名は、同じ問題・URLなら期限内は有効', () => {
    const signature = signImageCandidate(target, now);
    expect(verifyImageCandidate(target, signature, now)).toBe(true);
    expect(
      verifyImageCandidate(
        target,
        signature,
        now + CANDIDATE_SIGNATURE_VALID_MS,
      ),
    ).toBe(true);
  });

  it('期限を過ぎた署名は無効', () => {
    const signature = signImageCandidate(target, now);
    expect(
      verifyImageCandidate(
        target,
        signature,
        now + CANDIDATE_SIGNATURE_VALID_MS + 1,
      ),
    ).toBe(false);
  });

  it.each([
    ['問題ID', { quizId: 2 }],
    ['元画像のURL', { imageUrl: 'http://169.254.169.254/latest/meta-data/' }],
    ['サムネイルのURL', { thumbnailUrl: 'http://localhost/' }],
    ['サムネイルなし', { thumbnailUrl: null }],
  ])('%sを差し替えると無効', (_, change) => {
    const signature = signImageCandidate(target, now);
    expect(verifyImageCandidate({ ...target, ...change }, signature, now)).toBe(
      false,
    );
  });

  it('有効期限を書き換えると無効', () => {
    const [, mac] = signImageCandidate(target, now).split('.');
    const forged = `${now + 10 * CANDIDATE_SIGNATURE_VALID_MS}.${mac}`;
    expect(verifyImageCandidate(target, forged, now)).toBe(false);
  });

  it('秘密鍵が違えば無効', () => {
    const signature = signImageCandidate(target, now);
    process.env.QUIZ_IMAGE_SIGNING_SECRET = 'other-secret';
    expect(verifyImageCandidate(target, signature, now)).toBe(false);
  });

  it.each(['', 'abc', '123', `${now}.`, 'x.y', `${now}.a.b`])(
    '形式が不正な署名「%s」は無効',
    (signature) => {
      expect(verifyImageCandidate(target, signature, now)).toBe(false);
    },
  );

  it('秘密鍵が未設定なら署名できない', () => {
    delete process.env.QUIZ_IMAGE_SIGNING_SECRET;
    expect(() => signImageCandidate(target, now)).toThrow(
      'QUIZ_IMAGE_SIGNING_SECRET が設定されていません',
    );
  });
});
