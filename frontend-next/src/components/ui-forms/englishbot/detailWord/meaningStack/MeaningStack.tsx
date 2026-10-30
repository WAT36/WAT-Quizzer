import { Card } from '@/components/ui-elements/card/Card';
import { WordDetailItem } from '../wordDetailItem/WordDetailItem';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { Message, GetWordDetailAPIResponseDto, PullDownOptionDto } from 'quizzer-lib';
import { EditMeanModal } from '../editMeanModal/EditMeanModal';

interface MeaningStackProps {
  posList: PullDownOptionDto[];
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  // 更新が成功した後に呼ぶ。単語詳細を取り直す
  onUpdated?: () => Promise<void>;
}

export const MeaningStack = ({ posList, wordDetail, setMessage, onUpdated }: MeaningStackProps) => {
  const [meaningModalopen, setMeaningModalOpen] = useState(false);
  // 編集する意味のwordDetail.mean上の番号。-1は新規追加
  const [selectedMeanIndex, setSelectedMeanIndex] = useState<number>(-1);
  const handleOpen = (wordMeanIndex: number) => {
    setSelectedMeanIndex(wordMeanIndex);
    setMeaningModalOpen(true);
  };
  return (
    <Card variant="outlined" attr={['silver-card']}>
      <Typography align="left" variant="h4" component="p">
        {'意味'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress aria-label="読み込み中" />
        ) : (
          <Stack spacing={2}>
            {wordDetail.mean.map((x, index) => {
              return (
                <WordDetailItem
                  key={x.wordmean_id}
                  title={x.meaning}
                  topCaption={`[${x.partsofspeech.name}]`}
                  onEdit={() => handleOpen(index)}
                />
              );
            })}
            {/* 意味の新規追加ボタン */}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton aria-label="意味追加" onClick={(e) => handleOpen(-1)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            {/* 意味新規追加ボタン・編集ボタンを押すと出る意味編集モーダル（開くたびに入力を初期化するため、開いている間だけ描画する） */}
            {meaningModalopen && (
              <EditMeanModal
                isOpen={meaningModalopen}
                setIsOpen={setMeaningModalOpen}
                meanIndex={selectedMeanIndex}
                posList={posList}
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
