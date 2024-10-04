import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import { Message } from 'quizzer-lib';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  GetWordDetailAPIResponseDto,
  EditWordSubSourceAPIRequestDto,
  editEnglishWordSubSourceAPI,
  deleteEnglishWordSubSourceAPI,
  getWordDetailAPI
} from 'quizzer-lib';

interface SubSourceStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const SubSourceStack = ({ wordDetail, setMessage, setWordDetail }: SubSourceStackProps) => {
  const initEditWordSubSourceData = {
    id: -1,
    wordId: -1,
    subSource: ''
  };
  const [subSourceModalOpen, setSubSourceModalOpen] = useState(false);
  const [editWordSubSourceData, setEditWordSubSourceData] =
    useState<EditWordSubSourceAPIRequestDto>(initEditWordSubSourceData);

  const handleOpen = (index: number) => {
    setEditWordSubSourceData({
      id: index === -1 ? index : wordDetail.word_subsource[index].id,
      wordId: wordDetail.id,
      subSource: index === -1 ? '' : wordDetail.word_subsource[index].subsource
    });
    setSubSourceModalOpen(true);
  };

  return (
    <Card variant="outlined" attr={'silver-card'}>
      <Typography align="left" variant="h4" component="p">
        {'サブ出典'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress />
        ) : (
          <Stack spacing={2}>
            {wordDetail.word_subsource.map((x, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={index}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" variant="h5" component="p">
                        {x.subsource}
                      </Typography>
                      <Typography align="left" sx={{ fontSize: 14 }} color="text.secondary" component="p">
                        {`[${x.created_at.replaceAll('-', '/').replaceAll(/T.*/gi, '')}]`}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton onClick={(e) => handleOpen(-1)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            {/* TODO このモーダル系別コンポーネントに切り出したい。他のスタックのとこのも同様に */}
            <Modal isOpen={subSourceModalOpen} setIsOpen={setSubSourceModalOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  {'サブ出典' + (editWordSubSourceData.id === -1 ? '追加' : '更新')}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  サブ出典：
                  <TextField
                    variant="outlined"
                    defaultValue={editWordSubSourceData.subSource}
                    onChange={(e) => {
                      setEditWordSubSourceData({
                        ...editWordSubSourceData,
                        subSource: e.target.value
                      });
                    }}
                  />
                </Typography>
                <Button
                  label={'サブ出典' + (editWordSubSourceData.id === -1 ? '追加' : '更新')}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  onClick={async (e) => {
                    setSubSourceModalOpen(false);
                    const result = await editEnglishWordSubSourceAPI({
                      editWordSubSourceData
                    });
                    setMessage && setMessage(result.message);
                    // TODO 成功時の判定法
                    // 更新確認後、単語の意味を再取得させる
                    if (result.message.messageColor === 'success.light') {
                      const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                        .result as GetWordDetailAPIResponseDto;
                      setWordDetail && setWordDetail(newWordDetail);
                    }
                    setEditWordSubSourceData(initEditWordSubSourceData);
                  }}
                />
                <Button
                  label={'サブ出典削除'}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  disabled={editWordSubSourceData.id === -1}
                  onClick={async (e) => {
                    setSubSourceModalOpen(false);
                    const result = await deleteEnglishWordSubSourceAPI({
                      deleteWordSubSourceData: {
                        id: editWordSubSourceData.id
                      }
                    });
                    setMessage && setMessage(result.message);
                    // TODO 成功時の判定法
                    // 更新確認後、単語の意味を再取得させる
                    if (result.message.messageColor === 'success.light') {
                      const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                        .result as GetWordDetailAPIResponseDto;
                      setWordDetail && setWordDetail(newWordDetail);
                    }
                    setEditWordSubSourceData(initEditWordSubSourceData);
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
