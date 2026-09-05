import React from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';

export interface TooltipProps {
  text: React.ReactNode;
  className?: string;
}

// はみ出したテキストの全文を、PC(ホバー)・タッチ端末(タップ)の両方で表示できるようにするツールチップ
export const Tooltip = ({ text, className }: TooltipProps) => {
  if (text == null || text === '') {
    return null;
  }

  return (
    <MuiTooltip title={text} enterTouchDelay={0} leaveTouchDelay={5000}>
      <span className={className ?? 'block w-full truncate'}>{text}</span>
    </MuiTooltip>
  );
};
