import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { MessageState, WordDetailData, WordSubSourceData } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addEnglishWordSubSourceAPI } from '@/api/englishbot/addEnglishWordSubSourceAPI';
import { deleteEnglishWordSubSourceAPI } from '@/api/englishbot/deleteEnglishWordSubSourceAPI';

interface SubSourceStackProps {
  wordDetail: WordDetailData;
  modalIsOpen: boolean;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
}

export const SubSourceStack = ({
  wordDetail,
  modalIsOpen,
  setModalIsOpen,
  setMessage,
  setWordDetail
}: SubSourceStackProps) => {
  const [selectedSubSource, setSelectedSubSource] = useState<WordSubSourceData>({
    id: -1,
    subsource: ''
  });

  const handleOpen = (x: WordSubSourceData) => {
    if (setSelectedSubSource) {
      setSelectedSubSource(x);
    }
    if (setModalIsOpen) {
      setModalIsOpen(true);
    }
  };

  return (
    <>
      <Card variant="outlined" attr={'silver-card'}>
        <Typography align="left" variant="h4" component="p">
          {'サブ出典'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
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
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(x)}></Button>
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton
                onClick={(e) =>
                  handleOpen({
                    id: -1,
                    subsource: ''
                  })
                }
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            {/* TODO このモーダル系別コンポーネントに切り出したい。他のスタックのとこのも同様に */}
            <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  {'サブ出典' + (selectedSubSource.id === -1 ? '追加' : '更新')}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  サブ出典：
                  <TextField
                    variant="outlined"
                    defaultValue={selectedSubSource.subsource}
                    onChange={(e) => {
                      if (setSelectedSubSource) {
                        setSelectedSubSource({
                          ...selectedSubSource,
                          subsource: e.target.value
                        });
                      }
                    }}
                  />
                </Typography>
                <Button
                  label={'サブ出典' + (selectedSubSource.id === -1 ? '追加' : '更新')}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  onClick={(e) =>
                    addEnglishWordSubSourceAPI({
                      wordDetail,
                      subSourceData: selectedSubSource,
                      setMessage,
                      setModalIsOpen,
                      setSubSourceData: setSelectedSubSource,
                      setWordDetail
                    })
                  }
                />
                <Button
                  label={'サブ出典削除'}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  disabled={selectedSubSource.id === -1}
                  onClick={(e) =>
                    deleteEnglishWordSubSourceAPI({
                      wordDetail,
                      subSourceData: selectedSubSource,
                      setMessage,
                      setModalIsOpen,
                      setSubSourceData: setSelectedSubSource,
                      setWordDetail
                    })
                  }
                />
              </Box>
            </Modal>
          </Stack>
        </Box>
      </Card>
    </>
  );
};
