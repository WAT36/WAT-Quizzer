import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { Message, GetWordDetailAPIResponseDto } from 'quizzer-lib';
import React from 'react';
import { AddDerivativeModal } from '../addDerivativeModal/AddDerivativeModal';

interface DerivativeStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const DerivativeStack = ({ wordDetail, setMessage, setWordDetail }: DerivativeStackProps) => {
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
            {wordDetail.derivative ? (
              wordDetail.derivative.derivative_group.derivative.map((x, xindex) => {
                return x.word_id !== wordDetail.id ? (
                  // TODO ここも別コンポーネント化できない？
                  <Item key={xindex}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography component="div">
                        <Typography align="left" variant="h5" component="p">
                          {x.word.name}
                        </Typography>
                      </Typography>
                      {/* <Typography component="div" sx={{ marginLeft: 'auto' }}>
                          <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                        </Typography> */}
                    </Typography>
                  </Item>
                ) : (
                  <></>
                );
              })
            ) : (
              <></>
            )}
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
              setWordDetail={setWordDetail}
            />
          </Stack>
        )}
      </Box>
    </Card>
  );
};
