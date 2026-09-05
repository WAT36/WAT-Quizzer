import { Card } from '@/components/ui-elements/card/Card';
import { CardContent, CircularProgress, Typography } from '@mui/material';
import { GetRandomWordAPIResponse } from 'quizzer-lib';

interface RandomWordDisplayProps {
  wordData: GetRandomWordAPIResponse;
}

export const RandomWordDisplay = ({ wordData }: RandomWordDisplayProps) => {
  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <CardContent>
        <Typography variant="h6" component="h6" color="text.secondary">
          ランダムに１語
        </Typography>
        {wordData.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <>
            <Typography id="wordName" variant="h2" component="p" color="text.primary">
              {wordData.name}
            </Typography>
            {wordData.mean.map((data, index) => {
              return (
                <Typography key={index} variant="subtitle1" component="p" color="text.primary">
                  [{data.partsofspeech.name}] {data.meaning}
                </Typography>
              );
            })}
          </>
        )}
        ;
      </CardContent>
    </Card>
  );
};
