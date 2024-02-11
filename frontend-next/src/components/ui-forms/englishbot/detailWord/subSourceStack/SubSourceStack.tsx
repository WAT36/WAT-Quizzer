import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { MessageState, WordSubSourceData } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addEnglishWordSubSourceAPI } from '@/common/ButtonAPI';

interface SubSourceStackProps {
  id: string;
  wordSubSourceData: WordSubSourceData[];
  modalIsOpen: boolean;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setWordSubSourceData?: React.Dispatch<React.SetStateAction<WordSubSourceData[]>>;
}

export const SubSourceStack = ({
  id,
  wordSubSourceData,
  modalIsOpen,
  setModalIsOpen,
  setMessage,
  setWordSubSourceData
}: SubSourceStackProps) => {
  const [inputSubSourceName, setInputSubSourceName] = useState<string>('');

  const handleOpen = (x: WordSubSourceData, index: number) => {
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
            {wordSubSourceData.map((x, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={index}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" variant="h5" component="p">
                        {x.subSourceName}
                      </Typography>
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton
                onClick={(e) =>
                  handleOpen(
                    {
                      subSourceName: ''
                    },
                    -1
                  )
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
                      wordId: +id,
                      subSourceName: inputSubSourceName,
                      wordSubSourceData,
                      setMessage,
                      setModalIsOpen,
                      setSubSourceName: setInputSubSourceName,
                      setWordSubSourceData
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
