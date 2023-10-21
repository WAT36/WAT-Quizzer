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
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6" color="grey.700">
            今回の格言
          </Typography>
          <Typography variant="h2" component="p" color={sayingState.color}>
            {sayingState.saying}
          </Typography>
          <Typography variant="subtitle1" component="p" color="grey.500">
            出典
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
