import React from 'react';
import { Card } from '@/components/ui-elements/card/Card';

interface DisplayTestWordSectionProps {}

export const DisplayTestWordSection = ({}: DisplayTestWordSectionProps) => {
  return (
    <>
      <Card variant="outlined">
        <p>{'単語表示セクション'}</p>
      </Card>
    </>
  );
};
