import { createHmac, timingSafeEqual } from 'crypto';

// 画像候補の署名
// 候補取得APIが返した画像だけを登録APIで取得させるため、候補に署名を付けて返し、登録時に検証する
// （署名がないと、登録APIに任意のURL＝内部ネットワークのアドレスなどを渡して取得させられてしまう）

// 署名の有効期間（候補を表示してから選ぶまでの猶予）
export const CANDIDATE_SIGNATURE_VALID_MS = 60 * 60 * 1000;

export interface SignedImageCandidateTarget {
  quizId: number;
  imageUrl: string;
  thumbnailUrl: string | null;
}

const getSecret = (): string => {
  const secret = process.env.QUIZ_IMAGE_SIGNING_SECRET;
  if (!secret) {
    throw new Error('QUIZ_IMAGE_SIGNING_SECRET が設定されていません');
  }
  return secret;
};

const computeMac = (
  { quizId, imageUrl, thumbnailUrl }: SignedImageCandidateTarget,
  expiresAt: number,
): Buffer =>
  createHmac('sha256', getSecret())
    .update(JSON.stringify([quizId, imageUrl, thumbnailUrl, expiresAt]))
    .digest();

// 「有効期限(ミリ秒).HMAC(base64url)」の形の署名を作る
export const signImageCandidate = (
  target: SignedImageCandidateTarget,
  now: number = Date.now(),
): string => {
  const expiresAt = now + CANDIDATE_SIGNATURE_VALID_MS;
  return `${expiresAt}.${computeMac(target, expiresAt).toString('base64url')}`;
};

// 署名が、同じ問題・同じURLの組み合わせに対してこのシステムが付けたもので、期限内かを確認する
export const verifyImageCandidate = (
  target: SignedImageCandidateTarget,
  signature: string,
  now: number = Date.now(),
): boolean => {
  const [expiresAtText, macText, ...rest] = signature.split('.');
  const expiresAt = Number(expiresAtText);
  if (rest.length > 0 || !macText || !Number.isInteger(expiresAt)) {
    return false;
  }
  if (expiresAt < now) return false;
  const expected = computeMac(target, expiresAt);
  const actual = Buffer.from(macText, 'base64url');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};
