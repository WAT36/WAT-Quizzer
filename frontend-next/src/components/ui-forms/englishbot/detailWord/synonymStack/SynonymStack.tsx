import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { GetWordDetailAPIResponseDto, Message } from 'quizzer-lib';
import React from 'react';
import { AddSynonymModal } from '../addSynonymModal/AddSynonymModal';

interface SynonymStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const SynonymStack = ({ wordDetail, setMessage, setWordDetail }: SynonymStackProps) => {
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
                return (
                  <Item key={xindex}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography component="div">
                        <Typography align="left" variant="h5" component="p">
                          {x.synonym_word.name}
                        </Typography>
                      </Typography>
                      {/* <Typography component="div" sx={{ marginLeft: 'auto' }}>
                          <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                        </Typography> */}
                    </Typography>
                  </Item>
                );
              })}
              {wordDetail.synonym_word.map((x, xindex) => {
                return (
                  <Item key={xindex}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography component="div">
                        <Typography align="left" variant="h5" component="p">
                          {x.synonym_original.name}
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
              <IconButton aria-label="類義語追加" onClick={() => setSynonymModalOpen(true)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            <AddSynonymModal
              isOpen={synonymModalOpen}
              setIsOpen={setSynonymModalOpen}
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
