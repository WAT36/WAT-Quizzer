import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { MessageState } from '../../../../interfaces/state';

interface MessageCardProps {
  messageState: MessageState;
}

export const MessageCard = ({ messageState }: MessageCardProps) => {
  return (
    <>
      <Card variant="outlined" attr={'message-card'}>
        <CardContent>
          <Typography variant="h6" component="h6" color={messageState.messageColor}>
            {messageState.message}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
