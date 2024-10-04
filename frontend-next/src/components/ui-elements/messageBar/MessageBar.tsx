import React, { ReactNode } from 'react';
import { CircularProgress, Snackbar } from '@mui/material';
import { Message } from 'quizzer-lib';

interface MessageBarProps {
  messageState: Message;
  setMessageState?: React.Dispatch<React.SetStateAction<Message>>;
}

export const MessageBar = ({ messageState, setMessageState }: MessageBarProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={messageState.isDisplay || false}
      onClose={() => {
        if (setMessageState) {
          setMessageState({ ...messageState, isDisplay: false });
        }
      }}
      message={
        messageState.message === '通信中...' ? (
          <>
            <CircularProgress />
            {messageState.message}
          </>
        ) : (
          messageState.message
        )
      }
    />
  );
};
