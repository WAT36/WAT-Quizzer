import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { Message, GetWordDetailAPIResponseDto, PullDownOptionDto } from 'quizzer-lib';
import { EditMeanModal } from '../editMeanModal/EditMeanModal';

interface MeaningStackProps {
  posList: PullDownOptionDto[];
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const MeaningStack = ({ posList, wordDetail, setMessage, setWordDetail }: MeaningStackProps) => {
  const [meaningModalopen, setMeaningModalOpen] = useState(false);
  // TODO これいる？（sourcestackも）
  const [selectedMeanIndex, setSelectedMeanIndex] = useState<number>(-1); //仮
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
                <Item key={x.wordmean_id}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" sx={{ fontSize: 14 }} color="text.secondary" component="p">
                        {`[${x.partsofspeech.name}]`}
                      </Typography>
                      <Typography align="left" variant="h5" component="p">
                        {x.meaning}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                    </Typography>
                  </Typography>
                </Item>
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
                setWordDetail={setWordDetail}
              />
            )}
          </Stack>
        )}
      </Box>
    </Card>
  );
};
