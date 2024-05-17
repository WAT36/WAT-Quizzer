import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import { MessageState, PullDownOptionState, WordDetailData, WordSourceData } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { editEnglishWordSourceAPI } from '@/api/englishbot/editEnglishWordSourceAPI';
import { deleteEnglishWordSourceAPI } from '@/api/englishbot/deleteEnglishWordSourceAPI';

interface SourceStackProps {
  sourceList: PullDownOptionState[];
  wordDetail: WordDetailData;
  modalIsOpen: boolean;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
}

// 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
const displaySourceInput = (
  i: number,
  sourceList: PullDownOptionState[],
  inputSourceId: number,
  setInputSourceId?: React.Dispatch<React.SetStateAction<number>>
) => {
  return (
    <>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={inputSourceId || -1}
        label="source"
        key={i}
        sx={{ width: 1 }}
        onChange={(e) => {
          if (setInputSourceId) {
            setInputSourceId(+e.target.value);
          }
        }}
      >
        <MenuItem value={-1} key={-1}>
          選択なし
        </MenuItem>
        {sourceList.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export const SourceStack = ({
  sourceList,
  wordDetail,
  modalIsOpen,
  setModalIsOpen,
  setMessage,
  setWordDetail
}: SourceStackProps) => {
  // TODO word-sourceの構造変えたらここも直したい
  const [selectedWordSourceIndex, setSelectedWordSourceIndex] = useState<number>(-1); //仮
  const [inputSourceId, setInputSourceId] = useState<number>(-1);
  const [wordSourceData, setWordSourceData] = useState<WordSourceData>({
    word: {
      id: -1,
      name: ''
    },
    source: []
  });

  useEffect(() => {
    setWordSourceData({
      word: {
        id: wordDetail.id,
        name: wordDetail.name
      },
      source: wordDetail.word_source.map((x) => {
        return x.source;
      })
    });
  }, [wordDetail.id, wordDetail.name, wordDetail.word_source]);

  const handleOpen = (sourceId: number, index: number) => {
    if (setModalIsOpen) {
      setModalIsOpen(true);
    }
    setSelectedWordSourceIndex(index);
    setInputSourceId(sourceId);
  };
  return (
    <>
      <Card variant="outlined" attr={'silver-card'}>
        <Typography align="left" variant="h4" component="p">
          {'出典'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          <Stack spacing={2}>
            {wordSourceData.source.map((x, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={x.id}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" variant="h5" component="p">
                        {x.name}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(x.id, index)} />
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton onClick={(e) => handleOpen(-1, -1)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  {'出典' + (selectedWordSourceIndex === -1 ? '追加' : '更新')}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  出典：
                  {displaySourceInput(3, sourceList, inputSourceId, setInputSourceId)}
                </Typography>
                <Button
                  label={'出典' + (selectedWordSourceIndex === -1 ? '追加' : '更新')}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  onClick={(e) =>
                    editEnglishWordSourceAPI({
                      wordDetail,
                      wordSourceData,
                      selectedWordSourceIndex,
                      inputSourceId,
                      setMessage,
                      setModalIsOpen,
                      setWordDetail
                    })
                  }
                />
                <Button
                  label={'出典削除'}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  disabled={selectedWordSourceIndex === -1}
                  onClick={(e) =>
                    deleteEnglishWordSourceAPI({
                      word_id: wordDetail.id,
                      source_id: inputSourceId,
                      setMessage,
                      setModalIsOpen,
                      setWordDetail,
                      setSelectedWordSourceIndex
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
