import React from 'react';

import styles from './Footer.module.css';
import { FooterBar } from '@/components/ui-elements/footerBar/FooterBar';
import { Button } from '@/components/ui-elements/button/Button';

interface FooterProps {
  bgColor: string;
  topHref: string;
}

export const Footer = ({ bgColor = '#0077B6', topHref }: FooterProps) => (
  <FooterBar bgColor={bgColor}>
    <span className={styles.left}>
      <Button class="no-margin no-border" size="small" color="inherit" href={topHref} label="トップ" />
    </span>
    <span className={styles.right}>©️ Tatsuroh Wakasugi</span>
  </FooterBar>
);
