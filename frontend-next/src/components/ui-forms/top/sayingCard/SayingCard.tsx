import React from 'react';
import { SayingState } from '../../../../../interfaces/state';
import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';

interface SayingCardProps {
  sayingState: SayingState;
}

export const SayingCard = ({ sayingState }: SayingCardProps) => {
  return (
    <>
      <Card variant="outlined" attr="margin-vertical">
        <CardContent>
          <Typography variant="h6" component="h6" color="grey.700">
            今回の格言
          </Typography>
          <Typography id="saying" variant="h2" component="p" color={sayingState.color}>
            {sayingState.saying}
          </Typography>
          <Typography id="saying-explanation" variant="subtitle1" component="p" color="grey.800">
            {sayingState.explanation}
          </Typography>
          <Typography id="saying-bookname" variant="subtitle1" component="p" color="grey.600">
            {sayingState.name}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
