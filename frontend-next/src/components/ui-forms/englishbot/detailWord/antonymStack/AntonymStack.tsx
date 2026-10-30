import { Card } from '@/components/ui-elements/card/Card';
import { WordDetailItem } from '../wordDetailItem/WordDetailItem';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import React from 'react';
import { AddAntonymModal } from '../addAntonymModal/AddAntonymModal';

interface AntonymStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

export const AntonymStack = ({ wordDetail, setMessage, onUpdated }: AntonymStackProps) => {
  const [antonymModalOpen, setAntonymModalOpen] = useState<boolean>(false);

  return (
    <Card variant="outlined" attr={['silver-card']}>
      <Typography align="left" variant="h4" component="p">
        {'対義語'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <Stack spacing={2}>
            <>
              {wordDetail.antonym_original.map((x, xindex) => {
                return <WordDetailItem key={xindex} title={x.antonym_word.name} />;
              })}
              {wordDetail.antonym_word.map((x, xindex) => {
                return <WordDetailItem key={xindex} title={x.antonym_original.name} />;
              })}
            </>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton aria-label="反意語追加" onClick={() => setAntonymModalOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            <AddAntonymModal
              isOpen={antonymModalOpen}
              setIsOpen={setAntonymModalOpen}
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
