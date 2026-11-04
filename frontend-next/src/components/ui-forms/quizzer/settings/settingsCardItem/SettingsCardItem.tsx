import type { ReactNode } from 'react';
import { CardContent, CardHeader } from '@mui/material';

interface SettingsCardItemProps {
  subheader: string;
  // 中身の並べ方を指定するtailwindのクラス
  className?: string;
  children: ReactNode;
}

// SettingsCardの中に並べる、小見出し付きの1区画
export const SettingsCardItem = ({ subheader, className, children }: SettingsCardItemProps) => {
  return (
    <>
      <CardHeader subheader={subheader} />
      <CardContent className={className}>{children}</CardContent>
    </>
  );
};
