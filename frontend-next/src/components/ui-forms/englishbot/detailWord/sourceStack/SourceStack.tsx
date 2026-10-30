import { Card } from '@/components/ui-elements/card/Card';
import { WordDetailItem } from '../wordDetailItem/WordDetailItem';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { Message, GetWordDetailAPIResponseDto, PullDownOptionDto } from 'quizzer-lib';
import { EditSourceModal } from '../editSourceModal/EditSourceModal';

interface SourceStackProps {
  sourceList: PullDownOptionDto[];
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

export const SourceStack = ({ sourceList, wordDetail, setMessage, onUpdated }: SourceStackProps) => {
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  // 編集する出典のwordDetail.word_source上の番号。-1は新規追加
  const [selectedWordSourceIndex, setSelectedWordSourceIndex] = useState<number>(-1);

  const handleOpen = (index: number) => {
    setSelectedWordSourceIndex(index);
    setSourceModalOpen(true);
  };

  return (
    <Card variant="outlined" attr={['silver-card']}>
      <Typography align="left" variant="h4" component="p">
        {'出典'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <Stack spacing={2}>
            {wordDetail.word_source.map((x, index) => {
              return <WordDetailItem key={index} title={x.source.name} onEdit={() => handleOpen(index)} />;
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton aria-label="出典追加" onClick={(e) => handleOpen(-1)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            {/* 開くたびに入力を初期化するため、開いている間だけ描画する */}
            {sourceModalOpen && (
              <EditSourceModal
                isOpen={sourceModalOpen}
                setIsOpen={setSourceModalOpen}
                sourceIndex={selectedWordSourceIndex}
                sourceList={sourceList}
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
