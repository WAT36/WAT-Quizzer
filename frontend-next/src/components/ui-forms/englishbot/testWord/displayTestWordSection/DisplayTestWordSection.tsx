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
        <h2>{displayWordTest.wordName}</h2>
        {displayWordTest.choice && (
          <ol>
            <li>{displayWordTest.choice?.correct.mean}</li>
            <li>{displayWordTest.choice?.dummy[0].mean}</li>
            <li>{displayWordTest.choice?.dummy[1].mean}</li>
            <li>{displayWordTest.choice?.dummy[2].mean}</li>
          </ol>
        )}
      </Card>
    </>
  );
};
