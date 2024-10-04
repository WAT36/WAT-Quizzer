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
  AddEtymologyAPIRequestDto,
  GetWordDetailAPIResponseDto,
  LinkWordEtymologyAPIRequestDto,
  addEtymologyAPI,
  getWordDetailAPI,
  linkWordEtymologyAPI
} from 'quizzer-lib';

interface EtymologyStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const EtymologyStack = ({ wordDetail, setMessage, setWordDetail }: EtymologyStackProps) => {
  const [etymologyModalOpen, setEtymologyModalOpen] = useState<boolean>(false);
  const [addEtymologyModalOpen, setAddEtymologyModalOpen] = useState<boolean>(false);
  const [linkWordEtymologyData, setLinkWordEtymologyData] = useState<LinkWordEtymologyAPIRequestDto>({
    etymologyName: '',
    wordId: -1
  });
  const [addEtymologyData, setAddEtymologyData] = useState<AddEtymologyAPIRequestDto>({
    etymologyName: ''
  });

  const handleAddEtymologyModalOpen = () => {
    setAddEtymologyData({
      etymologyName: ''
    });
    setAddEtymologyModalOpen(true);
  };

  const handleEtymologyModalOpen = () => {
    setLinkWordEtymologyData({
      ...linkWordEtymologyData,
      wordId: wordDetail.id
    });
    setEtymologyModalOpen(true);
  };

  return (
      <Card variant="outlined" attr={'silver-card'}>
        <Typography align="left" variant="h4" component="p">
          {'語源'}
          <IconButton onClick={(e) => handleAddEtymologyModalOpen()}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          {wordDetail.id === -1 ? (
            <CircularProgress />
          ) : (
            <Stack spacing={2}>
              {wordDetail.word_etymology.map((x, xindex) => {
                return (
                  // TODO ここも別コンポーネント化できない？
                  <Item key={xindex}>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography component="div">
                        <Typography align="left" variant="h5" component="p">
                          {x.etymology.name}
                        </Typography>
                      </Typography>
                      {/* <Typography component="div" sx={{ marginLeft: 'auto' }}>
                          <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                        </Typography> */}
                    </Typography>
                  </Item>
                );
              })}
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <IconButton onClick={(e) => handleEtymologyModalOpen()}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
              {/* TODO モーダル類は別コンポーネントに切り分けたい */}
              <Modal isOpen={etymologyModalOpen} setIsOpen={setEtymologyModalOpen}>
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h4" component="h4">
                    {'語源紐付け'}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    語源名：
                    <TextField
                      variant="outlined"
                      defaultValue={linkWordEtymologyData.etymologyName}
                      onChange={(e) => {
                        setLinkWordEtymologyData({
                          ...linkWordEtymologyData,
                          etymologyName: e.target.value
                        });
                      }}
                    />
                  </Typography>
                  <Button
                    label={'語源紐付け'}
                    attr={'button-array'}
                    variant="contained"
                    color="primary"
                    onClick={async (e) => {
                      setEtymologyModalOpen(false);
                      const result = await linkWordEtymologyAPI({
                        linkWordEtymologyData
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
                      setLinkWordEtymologyData({
                        etymologyName: '',
                        wordId: -1
                      });
                    }}
                  />
                </Box>
              </Modal>
            </Stack>
          )}
        </Box>
        <Modal isOpen={addEtymologyModalOpen} setIsOpen={setAddEtymologyModalOpen}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" component="h4">
              {'語源追加'}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              語源名：
              <TextField
                variant="outlined"
                defaultValue={linkWordEtymologyData.etymologyName}
                onChange={(e) => {
                  setAddEtymologyData({
                    etymologyName: e.target.value
                  });
                }}
              />
            </Typography>
            <Button
              label={'語源追加'}
              attr={'button-array'}
              variant="contained"
              color="primary"
              onClick={async (e) => {
                setAddEtymologyModalOpen(false);
                const result = await addEtymologyAPI({
                  addEtymologyData
                });
                setMessage && setMessage(result.message);
                setAddEtymologyData({
                  etymologyName: ''
                });
              }}
            />
          </Box>
        </Modal>
      </Card>
  );
};
