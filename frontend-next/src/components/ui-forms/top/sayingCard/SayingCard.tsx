import React from 'react';
import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { GetSayingResponse } from 'quizzer-lib';

interface SayingCardProps {
  sayingResponse: GetSayingResponse;
}

export const SayingCard = ({ sayingResponse }: SayingCardProps) => {
  return (
    <>
      <Card variant="outlined" attr="margin-vertical">
        <CardContent>
          <Typography variant="h6" component="h6" color="grey.700">
            今回の格言
          </Typography>
          <Typography id="saying" variant="h2" component="p" color={'common.black'}>
            {sayingResponse.saying}
          </Typography>
          <Typography id="saying-explanation" variant="subtitle1" component="p" color="grey.800">
            {sayingResponse.explanation}
          </Typography>
          <Typography id="saying-bookname" variant="subtitle1" component="p" color="grey.600">
            {sayingResponse.selfhelp_book?.name || ''}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
