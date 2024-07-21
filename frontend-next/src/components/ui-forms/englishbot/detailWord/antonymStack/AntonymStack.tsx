import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import { MessageState } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddAntonymAPIRequestDto, GetWordDetailAPIResponseDto, addAntonymAPI, getWordDetailAPI } from 'quizzer-lib';

interface AntonymStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const AntonymStack = ({ wordDetail, setMessage, setWordDetail }: AntonymStackProps) => {
  const [antonymModalOpen, setAntonymModalOpen] = useState<boolean>(false);
  const [addAntonymData, setAddAntonymData] = useState<AddAntonymAPIRequestDto>({
    wordId: -1,
    antonymWordName: ''
  });

  const handleAntonymModalOpen = () => {
    setAddAntonymData({
      ...addAntonymData,
      wordId: wordDetail.id
    });
    setAntonymModalOpen(true);
  };

  return (
    <>
      <Card variant="outlined" attr={'silver-card'}>
        <Typography align="left" variant="h4" component="p">
          {'対義語'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          {wordDetail.id === -1 ? (
            <CircularProgress />
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
                <IconButton onClick={(e) => handleAntonymModalOpen()}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
              {/* TODO モーダル類は別コンポーネントに切り分けたい */}
              <Modal isOpen={antonymModalOpen} setIsOpen={setAntonymModalOpen}>
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h4" component="h4">
                    {'対義語追加'}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    対義語名：
                    <TextField
                      variant="outlined"
                      defaultValue={addAntonymData.antonymWordName}
                      onChange={(e) => {
                        setAddAntonymData({
                          ...addAntonymData,
                          antonymWordName: e.target.value
                        });
                      }}
                    />
                  </Typography>
                  <Button
                    label={'対義語追加'}
                    attr={'button-array'}
                    variant="contained"
                    color="primary"
                    onClick={async (e) => {
                      setAntonymModalOpen(false);
                      const result = await addAntonymAPI({
                        addAntonymData
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
                      setAddAntonymData({
                        wordId: -1,
                        antonymWordName: ''
                      });
                    }}
                  />
                </Box>
              </Modal>
            </Stack>
          )}
        </Box>
      </Card>
    </>
  );
};
