import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Box, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { MessageState, PullDownOptionState, WordDetailData, WordMeanData } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { editEnglishWordMeanAPI } from '@/api/englishbot/editEnglishWordMeanAPI';

interface MeaningStackProps {
  posList: PullDownOptionState[];
  wordDetail: WordDetailData;
  modalIsOpen: boolean;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<WordDetailData>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

// 品詞プルダウン表示、「その他」だったら入力用テキストボックスを出す
const displayPosInput = (
  i: number,
  posList: PullDownOptionState[],
  inputEditData: WordMeanData,
  setInputEditData?: React.Dispatch<React.SetStateAction<WordMeanData>>
) => {
  return (
    <>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={inputEditData?.partsofspeech.id || -1}
        label="partOfSpeech"
        key={i}
        sx={{ width: 1 }}
        onChange={(e) => {
          let posData;
          for (let i = 0; i < posList.length; i++) {
            if (+posList[i].value === +e.target.value) {
              posData = posList[i];
              break;
            }
          }
          if (setInputEditData && posData) {
            setInputEditData({
              ...inputEditData,
              partsofspeech: {
                id: +posData.value,
                name: posData.label
              }
            });
          }
        }}
      >
        <MenuItem value={-1} key={-1}>
          選択なし
        </MenuItem>
        {posList.map((x) => (
          <MenuItem value={x.value} key={x.value}>
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export const MeaningStack = ({
  posList,
  wordDetail,
  modalIsOpen,
  setMessage,
  setWordDetail,
  setModalIsOpen
}: MeaningStackProps) => {
  const emptyWordMeanData = {
    partsofspeech: {
      id: -1,
      name: ''
    },
    id: -1,
    wordmean_id: -1,
    meaning: ''
  };
  const [inputEditData, setInputEditData] = useState<WordMeanData>(emptyWordMeanData);

  const handleOpen = (x: WordMeanData, index: number) => {
    if (setModalIsOpen) {
      setModalIsOpen(true);
    }
    setInputEditData(x);
  };
  return (
    <>
      <Card variant="outlined" attr={'silver-card'}>
        <Typography align="left" variant="h4" component="p">
          {'意味'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          <Stack spacing={2}>
            {wordDetail.mean.map((x, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={x.wordmean_id}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" sx={{ fontSize: 14 }} color="text.secondary" component="p">
                        {`[${x.partsofspeech.name}]`}
                      </Typography>
                      <Typography align="left" variant="h5" component="p">
                        {x.meaning}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(x, index)}></Button>
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            {/* 意味の新規追加ボタン */}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton
                onClick={(e) =>
                  handleOpen(
                    {
                      ...emptyWordMeanData,
                      wordmean_id:
                        wordDetail.mean.reduce(
                          (previousValue, currentValue) => Math.max(previousValue, currentValue.wordmean_id),
                          -1
                        ) + 1
                    },
                    -1
                  )
                }
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            {/* 意味新規追加ボタン押すと出る意味編集モーダル */}
            <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  意味編集
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  品詞：
                  {displayPosInput(1, posList, inputEditData, setInputEditData)}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  意味：
                  <TextField
                    variant="outlined"
                    defaultValue={inputEditData?.meaning || ''}
                    onChange={(e) => {
                      if (setInputEditData) {
                        setInputEditData({
                          ...inputEditData,
                          meaning: e.target.value
                        });
                      }
                    }}
                  />
                </Typography>
                <Button
                  label={'意味更新'}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  onClick={(e) =>
                    editEnglishWordMeanAPI({
                      wordDetail,
                      inputEditData,
                      setMessage,
                      setModalIsOpen,
                      setInputEditData,
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
