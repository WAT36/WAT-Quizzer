import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';

interface MessageCardProps {
  message: string;
  messageColor: string;
}

export const MessageCard = ({ message, messageColor = 'common.black' }: MessageCardProps) => {
  return (
    <>
      <Card variant="outlined" attr={'message-card'}>
        <CardContent>
          <Typography variant="h6" component="h6" color={messageColor}>
            {message}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
