import { Card } from '@/components/ui-elements/card/Card';
import { CardContent, Typography } from '@mui/material';
import { GetRandomWordAPIResponse } from 'quizzer-lib';

interface RandomWordDisplayProps {
  wordData: GetRandomWordAPIResponse;
}

export const RandomWordDisplay = ({ wordData }: RandomWordDisplayProps) => {
  return (
    <Card variant="outlined" attr="margin-vertical">
      <CardContent>
        <Typography variant="h6" component="h6" color="grey.700">
          ランダムに１語
        </Typography>
        <Typography id="wordName" variant="h2" component="p" color="black">
          {wordData.name}
        </Typography>
        {wordData.mean.map((data, index) => {
          return (
            <Typography key={index} variant="subtitle1" component="p" color="grey.800">
              [{data.partsofspeech.name}] {data.meaning}
            </Typography>
          );
        })}
        ;
      </CardContent>
    </Card>
  );
};
