import * as http from 'http';
import { AddressInfo, LookupFunction } from 'net';
import {
  DownloadError,
  downloadExternalFile,
  isBlockedAddress,
} from './safeImageDownload';

describe('isBlockedAddress', () => {
  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.1.1',
    '169.254.169.254', // AWSのメタデータ
    '100.64.0.1',
    '0.0.0.0',
    '224.0.0.1',
    '255.255.255.255',
    '::1',
    '::',
    'fd00::1',
    'fe80::1',
    '::ffff:127.0.0.1', // IPv4射影
    '::ffff:169.254.169.254',
    'not-an-ip',
  ])('%sは接続しない', (address) => {
    expect(isBlockedAddress(address)).toBe(true);
  });

  it.each(['8.8.8.8', '93.184.216.34', '172.32.0.1', '2001:4860:4860::8888'])(
    '%sは接続してよい',
    (address) => {
      expect(isBlockedAddress(address)).toBe(false);
    },
  );
});

// テスト用のローカルサーバー。外部には接続しない
describe('downloadExternalFile', () => {
  let server: http.Server;
  let port: number;
  const png = Buffer.from('89504e470d0a1a0a0000', 'hex');

  // 「images.test」をローカルサーバーに向けるlookup（本番のアドレス確認の代わり）
  const toLocalhost: LookupFunction = (_hostname, options, callback) => {
    if (options.all) {
      (callback as unknown as (e: null, a: object[]) => void)(null, [
        { address: '127.0.0.1', family: 4 },
      ]);
    } else {
      callback(null, '127.0.0.1', 4);
    }
  };
  const allowAll = () => false;
  const local = { lookup: toLocalhost, isBlocked: allowAll, maxBytes: 100 };
  const url = (path: string) => `http://images.test:${port}${path}`;

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      switch (req.url) {
        case '/ok.png':
          res.writeHead(200, { 'Content-Type': 'image/png' });
          res.end(png);
          return;
        case '/redirect':
          res.writeHead(302, { Location: '/ok.png' });
          res.end();
          return;
        case '/loop':
          res.writeHead(302, { Location: '/loop' });
          res.end();
          return;
        case '/to-metadata':
          res.writeHead(302, {
            Location: 'http://169.254.169.254/latest/meta-data/',
          });
          res.end();
          return;
        case '/forbidden':
          res.writeHead(403);
          res.end('no');
          return;
        case '/big-declared':
          res.writeHead(200, { 'Content-Length': '1000' });
          res.end(Buffer.alloc(1000));
          return;
        case '/big-chunked':
          res.writeHead(200); // Content-Lengthなしで上限を超えて送る
          res.write(Buffer.alloc(60));
          res.end(Buffer.alloc(60));
          return;
        case '/slow-body': // ヘッダーと本文の一部だけ送り、残りが届かない
          res.writeHead(200);
          res.write(Buffer.alloc(10));
          return;
        case '/reset': // 本文の途中で接続が切れる
          res.writeHead(200, { 'Content-Length': '50' });
          res.write(Buffer.alloc(10), () => res.socket?.destroy());
          return;
        case '/slow':
          setTimeout(() => res.end(png), 1000);
          return;
        default:
          res.writeHead(404);
          res.end();
      }
    });
    await new Promise<void>((resolve) =>
      server.listen(0, '127.0.0.1', resolve),
    );
    port = (server.address() as AddressInfo).port;
  });

  afterAll(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });

  it('画像の中身とContent-Typeを返す', async () => {
    expect(await downloadExternalFile(url('/ok.png'), local)).toEqual({
      body: png,
      contentType: 'image/png',
    });
  });

  it('リダイレクトをたどる', async () => {
    const { body } = await downloadExternalFile(url('/redirect'), local);
    expect(body).toEqual(png);
  });

  it('リダイレクトが多すぎればエラー', async () => {
    await expect(downloadExternalFile(url('/loop'), local)).rejects.toThrow(
      'リダイレクトが多すぎます',
    );
  });

  it('200以外はステータス付きのエラー', async () => {
    await expect(
      downloadExternalFile(url('/forbidden'), local),
    ).rejects.toThrow(new DownloadError('HTTP 403'));
  });

  it.each(['/big-declared', '/big-chunked'])(
    '上限を超えるサイズ(%s)はエラー',
    async (path) => {
      await expect(downloadExternalFile(url(path), local)).rejects.toThrow(
        'サイズが大きすぎます',
      );
    },
  );

  it('時間がかかりすぎればタイムアウト', async () => {
    await expect(
      downloadExternalFile(url('/slow'), { ...local, timeoutMs: 100 }),
    ).rejects.toThrow('タイムアウトしました');
  });

  it('本文の受信中に時間がかかりすぎてもタイムアウト', async () => {
    const error = await downloadExternalFile(url('/slow-body'), {
      ...local,
      timeoutMs: 100,
    }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DownloadError);
    expect((error as Error).message).toBe('タイムアウトしました');
  });

  it('本文の途中で接続が切れたらDownloadError', async () => {
    const error = await downloadExternalFile(url('/reset'), local).catch(
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(DownloadError);
  });

  it.each(['ftp://images.test/a.png', 'file:///etc/passwd', 'not a url'])(
    'http(s)でないURL(%s)はエラー',
    async (target) => {
      await expect(downloadExternalFile(target, local)).rejects.toThrow(
        DownloadError,
      );
    },
  );

  describe('本番のアドレス確認', () => {
    it.each([
      () => `http://127.0.0.1:${port}/ok.png`,
      () => `http://[::1]:${port}/ok.png`,
      () => `http://localhost:${port}/ok.png`,
      () => 'http://169.254.169.254/latest/meta-data/',
    ])('内部アドレスには接続しない(%#)', async (target) => {
      await expect(
        downloadExternalFile(target(), { maxBytes: 100 }),
      ).rejects.toThrow('接続できないアドレスです');
    });

    it('リダイレクト先が内部アドレスなら接続しない', async () => {
      await expect(
        downloadExternalFile(url('/to-metadata'), {
          maxBytes: 100,
          lookup: toLocalhost, // 最初の接続だけローカルサーバーへ
        }),
      ).rejects.toThrow('接続できないアドレスです(169.254.169.254)');
    });
  });
});
