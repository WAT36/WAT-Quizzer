import { Card } from '@/components/ui-elements/card/Card';
import { WordDetailItem } from '../wordDetailItem/WordDetailItem';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import type { Message } from 'quizzer-lib';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { GetWordDetailAPIResponseDto } from 'quizzer-lib';
import { EditSubSourceModal } from '../editSubSourceModal/EditSubSourceModal';

interface SubSourceStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

export const SubSourceStack = ({ wordDetail, setMessage, onUpdated }: SubSourceStackProps) => {
  const [subSourceModalOpen, setSubSourceModalOpen] = useState(false);
  const [selectedSubSourceIndex, setSelectedSubSourceIndex] = useState<number>(-1);

  const handleOpen = (index: number) => {
    setSelectedSubSourceIndex(index);
    setSubSourceModalOpen(true);
  };

  return (
    <Card variant="outlined" attr={['silver-card']}>
      <Typography align="left" variant="h4" component="p">
        {'サブ出典'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <Stack spacing={2}>
            {wordDetail.word_subsource.map((x, index) => {
              return (
                <WordDetailItem
                  key={index}
                  title={x.subsource}
                  bottomCaption={`[${x.created_at.replaceAll('-', '/').replaceAll(/T.*/gi, '')}]`}
                  onEdit={() => handleOpen(index)}
                />
              );
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton aria-label="サブ出典追加" onClick={(e) => handleOpen(-1)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            {/* 開くたびに入力を初期化するため、開いている間だけ描画する */}
            {subSourceModalOpen && (
              <EditSubSourceModal
                isOpen={subSourceModalOpen}
                setIsOpen={setSubSourceModalOpen}
                subSourceIndex={selectedSubSourceIndex}
                wordDetail={wordDetail}
                setMessage={setMessage}
                onUpdated={onUpdated}
              />
            )}
          </Stack>
        )}
      </Box>
    </Card>
  );
};
