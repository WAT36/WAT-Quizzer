import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, Stack, Typography } from '@mui/material';
import styles from '../Stack.module.css';
import { WordSourceData } from '../../../../../../interfaces/state';

interface SourceStackProps {
  wordSourceData: WordSourceData[];
  modalIsOpen: boolean;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SourceStack = ({ wordSourceData, modalIsOpen, setModalIsOpen }: SourceStackProps) => {
  const handleOpen = (x: WordSourceData) => {
    if (setModalIsOpen) {
      setModalIsOpen(true);
    }
  };
  return (
    <>
      <Card variant="outlined">
        <Typography align="left" variant="h4" component="p">
          {'出典'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          <Stack spacing={2}>
            {wordSourceData.map((x) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={x.wordId}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" variant="h5" component="p">
                        {x.sourceName}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(x)} />
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
              <Box className={styles.mordalBox}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  出典編集
                </Typography>
                {/* <Typography sx={{ mt: 2 }}>{displaySourceInput(3)}</Typography>
                      <Button variant="contained">更新</Button> */}
              </Box>
            </Modal>
          </Stack>
        </Box>
      </Card>
    </>
  );
};
