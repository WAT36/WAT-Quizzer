import React from 'react';
import { Typography } from '@mui/material';

interface DisplaySentenceProps {
  sentence: string;
  checked?: boolean;
  color?: string;
  id?: string;
}

export const DisplaySentence = ({ checked, sentence, color, id, ...props }: DisplaySentenceProps) => {
  return (
    <Typography variant="subtitle1" component="p" color={color} id={id} {...props}>
      {checked ? '✅' : ''}
      {sentence
        .replaceAll('\\n', '\n')
        .split(/(\n)/)
        .map((item, index) => {
          return <React.Fragment key={index}>{item.match(/\n/) ? <br /> : item}</React.Fragment>;
        })}
    </Typography>
  );
};
