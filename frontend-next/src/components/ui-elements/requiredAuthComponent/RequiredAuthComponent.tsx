'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasValidAccessToken, refreshAccessToken } from 'quizzer-lib';
import { isMockMode } from '@/utils/api-wrapper';

type Props = {
  children: React.ReactNode;
};

// 画面表示時に1回だけ認証状態を確認する
// 表示後のトークン期限切れはAPI呼び出し時に処理する（refresh → 失敗したら再ログインモーダル）ので、ここでは見ない
export default function RequiredAuthComponent({ children }: Props) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 旧方式でlocalStorageに保存していたトークンを削除
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');

    // モック環境では認証チェックをスキップ
    // リロード直後などメモリにトークンが無い場合は、refreshTokenのCookieで取り直す
    const check = async () =>
      isMockMode() || hasValidAccessToken() || (await refreshAccessToken()) === 'success';

    let cancelled = false;
    check().then((authenticated) => {
      if (cancelled) return;
      if (authenticated) {
        setIsAuthenticated(true);
      } else {
        router.replace('/login');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
