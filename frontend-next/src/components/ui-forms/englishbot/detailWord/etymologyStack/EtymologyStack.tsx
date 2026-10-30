import { Card } from '@/components/ui-elements/card/Card';
import { WordDetailItem } from '../wordDetailItem/WordDetailItem';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { Message, GetWordDetailAPIResponseDto } from 'quizzer-lib';
import { AddEtymologyModal } from '../addEtymologyModal/AddEtymologyModal';
import { LinkEtymologyModal } from '../linkEtymologyModal/LinkEtymologyModal';

interface EtymologyStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

export const EtymologyStack = ({ wordDetail, setMessage, onUpdated }: EtymologyStackProps) => {
  const [etymologyModalOpen, setEtymologyModalOpen] = useState<boolean>(false);
  const [addEtymologyModalOpen, setAddEtymologyModalOpen] = useState<boolean>(false);

  return (
    <Card variant="outlined" attr={['silver-card']}>
      <Typography align="left" variant="h4" component="p">
        {'語源'}
        <IconButton aria-label="語源追加" onClick={() => setAddEtymologyModalOpen(true)}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <Stack spacing={2}>
            {wordDetail.word_etymology.map((x, xindex) => {
              return (
                <WordDetailItem key={xindex} title={x.etymology.name} />
              );
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton aria-label="語源紐付け" onClick={() => setEtymologyModalOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            <LinkEtymologyModal
              isOpen={etymologyModalOpen}
              setIsOpen={setEtymologyModalOpen}
              wordDetail={wordDetail}
              setMessage={setMessage}
              onUpdated={onUpdated}
            />
          </Stack>
        )}
      </Box>
      <AddEtymologyModal isOpen={addEtymologyModalOpen} setIsOpen={setAddEtymologyModalOpen} setMessage={setMessage} />
    </Card>
  );
};
