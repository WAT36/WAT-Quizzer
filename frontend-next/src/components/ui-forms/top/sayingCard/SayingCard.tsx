import React from 'react';
import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { GetSayingResponse } from 'quizzer-lib';
import { getSayingAPI } from '@/utils/api-wrapper';
import { Button } from '@/components/ui-elements/button/Button';
import { DisplaySentence } from '@/components/ui-elements/sentence/DisplaySentence';

interface SayingCardProps {
  sayingResponse: GetSayingResponse;
  setSaying: React.Dispatch<React.SetStateAction<GetSayingResponse>>;
}

export const SayingCard = ({ sayingResponse, setSaying }: SayingCardProps) => {
  return (
    <>
      <Card variant="outlined" attr={['margin-vertical']}>
        <CardContent>
          <Typography variant="h6" component="h6" color="text.secondary">
            今回の格言
            <Button
              label={'更新'}
              variant={'text'}
              size={'small'}
              attr={'after-inline'}
              onClick={async (e) => {
                const result = await getSayingAPI({ getSayingRequestData: {} });
                result.result && setSaying(result.result as GetSayingResponse);
              }}
            />
          </Typography>
          <Typography id="saying" variant="h2" component="p" color="text.primary">
            {sayingResponse.saying}
          </Typography>
          <DisplaySentence sentence={sayingResponse.explanation || ''} id="saying-explanation" color="text.primary" />
          <DisplaySentence
            sentence={sayingResponse.selfhelp_book?.name || ''}
            id="saying-bookname"
            color="text.secondary"
          />
        </CardContent>
      </Card>
    </>
  );
};
