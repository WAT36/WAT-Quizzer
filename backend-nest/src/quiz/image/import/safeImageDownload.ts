import * as dns from 'dns';
import * as http from 'http';
import * as https from 'https';
import { BlockList, isIP, LookupFunction } from 'net';

// 外部の画像を安全にダウンロードする
// 画像のURLは外部サイトのものなので、サーバーから取りに行くと内部ネットワーク（AWSのメタデータ等）を
// 読まれる危険がある（SSRF）。署名で「候補として返したURL」に限定したうえで、さらに次を守る
// - http(s)のみ
// - 接続先のIPアドレスがプライベート・ループバック・リンクローカル等なら接続しない
//   （名前解決の結果を接続直前に確認するので、確認後に別のアドレスへ向けるDNSリバインディングも防げる）
// - リダイレクトは回数を制限し、行き先も同じ確認をする
// - サイズ上限・タイムアウト

export const DOWNLOAD_TIMEOUT_MS = 8000;
export const MAX_REDIRECTS = 3;

// 接続してはいけないアドレス（内部・予約済みのもの）
const blockedAddresses = new BlockList();
[
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10], // キャリアグレードNAT
  ['127.0.0.0', 8],
  ['169.254.0.0', 16], // リンクローカル（AWSのメタデータ 169.254.169.254 を含む）
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4], // マルチキャスト
  ['240.0.0.0', 4], // 予約済み・ブロードキャスト
].forEach(([address, prefix]) =>
  blockedAddresses.addSubnet(address as string, prefix as number, 'ipv4'),
);
[
  ['::', 128],
  ['::1', 128],
  ['fc00::', 7], // ユニークローカル
  ['fe80::', 10], // リンクローカル
  ['ff00::', 8], // マルチキャスト
].forEach(([address, prefix]) =>
  blockedAddresses.addSubnet(address as string, prefix as number, 'ipv6'),
);

// 接続してはいけないアドレスならtrue（IPv4射影アドレス ::ffff:127.0.0.1 なども判定される）
export const isBlockedAddress = (address: string): boolean => {
  const family = isIP(address);
  if (family === 0) return true;
  return blockedAddresses.check(address, family === 4 ? 'ipv4' : 'ipv6');
};

// 名前解決した全アドレスを確認し、接続してはいけないものが1つでもあればエラーにするlookup
export const safeLookup: LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) {
      callback(error, '', 4);
      return;
    }
    const blocked = addresses.find(({ address }) => isBlockedAddress(address));
    if (addresses.length === 0 || blocked) {
      callback(
        new Error(`接続できないアドレスです(${blocked?.address ?? hostname})`),
        '',
        4,
      );
      return;
    }
    if (options.all) {
      (callback as unknown as (e: null, a: dns.LookupAddress[]) => void)(
        null,
        addresses,
      );
    } else {
      callback(null, addresses[0].address, addresses[0].family);
    }
  });
};

export interface DownloadedFile {
  body: Buffer;
  contentType: string | null;
}

export interface DownloadOptions {
  maxBytes: number;
  timeoutMs?: number;
  // テストでローカルのサーバーに接続するために差し替えられるようにする
  lookup?: LookupFunction;
  isBlocked?: (address: string) => boolean;
}

export class DownloadError extends Error {}

const REDIRECT_STATUSES = [301, 302, 303, 307, 308];

// 通信中のエラーをDownloadErrorにする（中断はタイムアウトによるもの）
const toDownloadError = (error: Error): DownloadError =>
  error.name === 'AbortError'
    ? new DownloadError('タイムアウトしました')
    : new DownloadError(error.message);

// 1回分のリクエスト。リダイレクトなら行き先のURLを返す
const requestOnce = (
  url: URL,
  { maxBytes, lookup, isBlocked }: Required<Omit<DownloadOptions, 'timeoutMs'>>,
  signal: AbortSignal,
): Promise<DownloadedFile | { redirectTo: URL }> =>
  new Promise((resolve, reject) => {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      reject(new DownloadError(`対応していないURLです(${url.protocol})`));
      return;
    }
    // IPアドレスが直接書かれたURLは名前解決（lookup）を通らないので、ここで確認する
    const literal = url.hostname.replace(/^\[|\]$/g, '');
    if (isIP(literal) !== 0 && isBlocked(literal)) {
      reject(new DownloadError(`接続できないアドレスです(${literal})`));
      return;
    }

    const client = url.protocol === 'https:' ? https : http;
    const req = client.get(
      url,
      {
        lookup,
        signal,
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/*' },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (REDIRECT_STATUSES.includes(status) && res.headers.location) {
          res.resume();
          try {
            resolve({ redirectTo: new URL(res.headers.location, url) });
          } catch {
            reject(new DownloadError('リダイレクト先のURLが不正です'));
          }
          return;
        }
        if (status !== 200) {
          res.resume();
          reject(new DownloadError(`HTTP ${status}`));
          return;
        }
        const declared = Number(res.headers['content-length'] ?? 0);
        if (declared > maxBytes) {
          res.destroy();
          reject(new DownloadError(`サイズが大きすぎます(${declared}バイト)`));
          return;
        }
        const chunks: Buffer[] = [];
        let total = 0;
        res.on('data', (chunk: Buffer) => {
          total += chunk.length;
          if (total > maxBytes) {
            res.destroy();
            reject(new DownloadError(`サイズが大きすぎます(${total}バイト超)`));
            return;
          }
          chunks.push(chunk);
        });
        res.on('end', () =>
          resolve({
            body: Buffer.concat(chunks),
            contentType: res.headers['content-type'] ?? null,
          }),
        );
        // 本文の受信中のタイムアウト・切断もDownloadErrorにする
        res.on('error', (error) => reject(toDownloadError(error)));
      },
    );
    req.on('error', (error) => reject(toDownloadError(error)));
  });

// URLのファイルをダウンロードする。失敗時はDownloadError（理由はメッセージ）
export const downloadExternalFile = async (
  rawUrl: string,
  {
    maxBytes,
    timeoutMs = DOWNLOAD_TIMEOUT_MS,
    lookup = safeLookup,
    isBlocked = isBlockedAddress,
  }: DownloadOptions,
): Promise<DownloadedFile> => {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new DownloadError('URLが不正です');
  }
  const signal = AbortSignal.timeout(timeoutMs);
  for (let redirects = 0; ; redirects++) {
    const result = await requestOnce(
      url,
      { maxBytes, lookup, isBlocked },
      signal,
    );
    if (!('redirectTo' in result)) return result;
    if (redirects >= MAX_REDIRECTS) {
      throw new DownloadError('リダイレクトが多すぎます');
    }
    url = result.redirectTo;
  }
};
