import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  GetWordDetailAPIResponseDto,
  getWordDetailAPI,
  AddSynonymAPIRequestDto,
  addSynonymAPI,
  Message
} from 'quizzer-lib';
import React from 'react';

interface SynonymStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const SynonymStack = ({ wordDetail, setMessage, setWordDetail }: SynonymStackProps) => {
  const [synonymModalOpen, setSynonymModalOpen] = useState<boolean>(false);
  const [addSynonymData, setAddSynonymData] = useState<AddSynonymAPIRequestDto>({
    wordId: -1,
    synonymWordName: ''
  });

  const handleSynonymModalOpen = () => {
    setAddSynonymData({
      ...addSynonymData,
      wordId: wordDetail.id
    });
    setSynonymModalOpen(true);
  };

  return (
    <Card variant="outlined" attr={'silver-card'}>
      <Typography align="left" variant="h4" component="p">
        {'類義語'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress />
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
              <IconButton onClick={(e) => handleSynonymModalOpen()}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            {/* TODO モーダル類は別コンポーネントに切り分けたい */}
            <Modal isOpen={synonymModalOpen} setIsOpen={setSynonymModalOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  {'類義語追加'}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  類義語名：
                  <TextField
                    variant="outlined"
                    defaultValue={addSynonymData.synonymWordName}
                    onChange={(e) => {
                      setAddSynonymData({
                        ...addSynonymData,
                        synonymWordName: e.target.value
                      });
                    }}
                  />
                </Typography>
                <Button
                  label={'類義語追加'}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  onClick={async (e) => {
                    setSynonymModalOpen(false);
                    const result = await addSynonymAPI({
                      addSynonymData
                    });
                    setMessage && setMessage(result.message);
                    // TODO 成功時の判定法
                    // 更新確認後、単語の意味を再取得させる
                    // TODO この再取得の部分は共通関数化できないかな
                    if (result.message.messageColor === 'success.light') {
                      const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                        .result as GetWordDetailAPIResponseDto;
                      setWordDetail && setWordDetail(newWordDetail);
                    }
                    setAddSynonymData({
                      wordId: -1,
                      synonymWordName: ''
                    });
                  }}
                />
              </Box>
            </Modal>
          </Stack>
        )}
      </Box>
    </Card>
  );
};
