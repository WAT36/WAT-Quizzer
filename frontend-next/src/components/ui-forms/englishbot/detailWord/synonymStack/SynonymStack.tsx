import { Card } from '@/components/ui-elements/card/Card';
import { WordDetailItem } from '../wordDetailItem/WordDetailItem';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import React from 'react';
import { AddSynonymModal } from '../addSynonymModal/AddSynonymModal';

interface SynonymStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

export const SynonymStack = ({ wordDetail, setMessage, onUpdated }: SynonymStackProps) => {
  const [synonymModalOpen, setSynonymModalOpen] = useState<boolean>(false);

  return (
    <Card variant="outlined" attr={['silver-card']}>
      <Typography align="left" variant="h4" component="p">
        {'類義語'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <Stack spacing={2}>
            <>
              {wordDetail.synonym_original.map((x, xindex) => {
                return <WordDetailItem key={xindex} title={x.synonym_word.name} />;
              })}
              {wordDetail.synonym_word.map((x, xindex) => {
                return <WordDetailItem key={xindex} title={x.synonym_original.name} />;
              })}
            </>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton aria-label="類義語追加" onClick={() => setSynonymModalOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            <AddSynonymModal
              isOpen={synonymModalOpen}
              setIsOpen={setSynonymModalOpen}
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
