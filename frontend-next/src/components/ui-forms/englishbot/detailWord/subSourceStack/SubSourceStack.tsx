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
  const [inputSubSourceName, setInputSubSourceName] = useState<string>('');

  const handleOpen = (x: WordSubSourceData) => {
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
                  </Typography>
                </Item>
              );
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton
                onClick={(e) =>
                  handleOpen({
                    subsource: ''
                  })
                }
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  サブ出典追加
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  サブ出典：
                  <TextField
                    variant="outlined"
                    defaultValue={''}
                    onChange={(e) => {
                      if (setInputSubSourceName) {
                        setInputSubSourceName(e.target.value);
                      }
                    }}
                  />
                </Typography>
                <Button
                  label={'サブ出典追加'}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  onClick={(e) =>
                    addEnglishWordSubSourceAPI({
                      wordDetail,
                      subSourceName: inputSubSourceName,
                      setMessage,
                      setModalIsOpen,
                      setSubSourceName: setInputSubSourceName,
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
