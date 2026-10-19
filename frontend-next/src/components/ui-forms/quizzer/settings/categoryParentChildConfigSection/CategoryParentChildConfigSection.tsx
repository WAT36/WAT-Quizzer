import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { CategoryParentChildSection } from '../categoryParentChildSection/CategoryParentChildSection';
import type { PullDownOptionDto, Message } from 'quizzer-lib';

interface CategoryParentChildConfigSectionProps {
  filelistoption: PullDownOptionDto[];
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const CategoryParentChildConfigSection = ({
  filelistoption,
  setMessage,
}: CategoryParentChildConfigSectionProps) => {
  return (
    <Card variant="outlined" className="!my-[10px]">
      <CardHeader title="カテゴリ親子関係" />
      <CardContent>
        <Card variant="outlined">
          <CategoryParentChildSection filelistoption={filelistoption} setMessage={setMessage} />
        </Card>
      </CardContent>
    </Card>
  );
};
