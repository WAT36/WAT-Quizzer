import { Card } from '@/components/ui-elements/card/Card';
import { WordDetailItem } from '../wordDetailItem/WordDetailItem';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { Message, GetWordDetailAPIResponseDto } from 'quizzer-lib';
import React from 'react';
import { AddDerivativeModal } from '../addDerivativeModal/AddDerivativeModal';

interface DerivativeStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

export const DerivativeStack = ({ wordDetail, setMessage, onUpdated }: DerivativeStackProps) => {
  const [derivativeModalOpen, setDerivativeModalOpen] = useState<boolean>(false);

  return (
    <Card variant="outlined" attr={['silver-card']}>
      <Typography align="left" variant="h4" component="p">
        {'派生語'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <Stack spacing={2}>
            {/* 派生語グループには元単語自身も含まれるので除く */}
            {wordDetail.derivative?.derivative_group.derivative
              .filter((x) => x.word_id !== wordDetail.id)
              .map((x) => (
                <WordDetailItem key={x.word_id} title={x.word.name} />
              ))}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton aria-label="派生語追加" onClick={() => setDerivativeModalOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            <AddDerivativeModal
              isOpen={derivativeModalOpen}
              setIsOpen={setDerivativeModalOpen}
              wordDetail={wordDetail}
              setMessage={setMessage}
              onUpdated={onUpdated}
            />
          </Stack>
        )}
      </Box>
    </Card>
  );
};
