import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';

interface SettingsCardProps {
  title: string;
  children: ReactNode;
}

// 設定画面の1項目分の枠。中身はSettingsCardItemで並べる
export const SettingsCard = ({ title, children }: SettingsCardProps) => {
  return (
    <Card variant="outlined" className="!my-[10px]">
      <CardHeader title={title} />
      <CardContent>
        <Card variant="outlined">{children}</Card>
      </CardContent>
    </Card>
  );
};
