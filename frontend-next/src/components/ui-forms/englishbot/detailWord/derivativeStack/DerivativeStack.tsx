import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  Message,
  AddDerivativeAPIRequestDto,
  GetWordDetailAPIResponseDto,
  addDerivativeAPI,
  getWordDetailAPI
} from 'quizzer-lib';
import React from 'react';

interface DerivativeStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const DerivativeStack = ({ wordDetail, setMessage, setWordDetail }: DerivativeStackProps) => {
  const [derivativeModalOpen, setDerivativeModalOpen] = useState<boolean>(false);
  const [addDerivativeData, setAddDerivativeData] = useState<AddDerivativeAPIRequestDto>({
    wordName: '',
    derivativeName: ''
  });

  const handleDerivativeModalOpen = () => {
    setAddDerivativeData({
      ...addDerivativeData,
      wordName: wordDetail.name
    });
    setDerivativeModalOpen(true);
  };

  return (
    <Card variant="outlined" attr={'silver-card'}>
      <Typography align="left" variant="h4" component="p">
        {'派生語'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress />
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
              <IconButton onClick={(e) => handleDerivativeModalOpen()}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            {/* TODO モーダル類は別コンポーネントに切り分けたい */}
            <Modal isOpen={derivativeModalOpen} setIsOpen={setDerivativeModalOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  {'派生語追加'}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  派生語名：
                  <TextField
                    variant="outlined"
                    defaultValue={addDerivativeData.derivativeName}
                    onChange={(e) => {
                      setAddDerivativeData({
                        ...addDerivativeData,
                        derivativeName: e.target.value
                      });
                    }}
                  />
                </Typography>
                <Button
                  label={'派生語追加'}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  onClick={async (e) => {
                    setDerivativeModalOpen(false);
                    const result = await addDerivativeAPI({
                      addDerivativeData
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
                    setAddDerivativeData({
                      wordName: '',
                      derivativeName: ''
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
