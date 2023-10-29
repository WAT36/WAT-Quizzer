import React from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { DisplayWordTestState } from '../../../../../../interfaces/state';

interface DisplayTestWordSectionProps {
  displayWordTest: DisplayWordTestState;
}

export const DisplayTestWordSection = ({ displayWordTest }: DisplayTestWordSectionProps) => {
  return (
    <>
      <Card variant="outlined">
        <p>{'単語表示セクション'}</p>
        <p>{displayWordTest.wordName}</p>
      </Card>
    </>
  );
};
