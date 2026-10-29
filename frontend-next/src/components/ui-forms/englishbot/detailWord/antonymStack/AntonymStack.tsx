import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
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
                return (
                  <Item key={xindex}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography component="div">
                        <Typography align="left" variant="h5" component="p">
                          {x.antonym_word.name}
                        </Typography>
                      </Typography>
                      {/* <Typography component="div" sx={{ marginLeft: 'auto' }}>
                          <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                        </Typography> */}
                    </Typography>
                  </Item>
                );
              })}
              {wordDetail.antonym_word.map((x, xindex) => {
                return (
                  <Item key={xindex}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography component="div">
                        <Typography align="left" variant="h5" component="p">
                          {x.antonym_original.name}
                        </Typography>
                      </Typography>
                      {/* <Typography component="div" sx={{ marginLeft: 'auto' }}>
                          <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                        </Typography> */}
                    </Typography>
                  </Item>
                );
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
