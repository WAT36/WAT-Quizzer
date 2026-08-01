import React from 'react';

import { FooterBar } from '@/components/ui-elements/footerBar/FooterBar';
import { Button } from '@/components/ui-elements/button/Button';
import { useRouter } from 'next/router';

interface FooterProps {
  bgColor: string;
  topHref: string;
}

export const Footer = ({ bgColor = '#006494', topHref }: FooterProps) => {
  const router = useRouter();

  return (
    <FooterBar bgColor={bgColor}>
      <span className="absolute left-0 top-0 h-full flex items-center px-2 text-sm">
        <Button attr="no-margin no-border" size="small" color="inherit" href={topHref} label="トップ" />
        <Button
          attr="no-margin no-border"
          size="small"
          color="inherit"
          onClick={(e) => {
            // TODO 別関数にして別ファイルに置く？
            localStorage.removeItem('idToken');
            localStorage.removeItem('accessToken');
            router.push('/login');
          }}
          label="ログアウト"
        />
      </span>
      <span className="absolute right-2.5 top-0 h-full flex items-center text-xs md:text-sm">©️ Tatsuroh Wakasugi</span>
    </FooterBar>
  );
};
