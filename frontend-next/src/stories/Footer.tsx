import React from 'react';

import './footer.css';
import { Button } from '@mui/material';

interface FooterProps {
  bgColor: string;
  topHref: string;
}

export const Footer = ({ bgColor = '#0077B6', topHref }: FooterProps) => (
  <footer style={{ backgroundColor: bgColor }}>
    <span className="left">
      <Button size="small" color="inherit" href={topHref}>
        トップ
      </Button>
    </span>
    <span className="right">©️ Tatsuroh Wakasugi</span>
  </footer>
);
