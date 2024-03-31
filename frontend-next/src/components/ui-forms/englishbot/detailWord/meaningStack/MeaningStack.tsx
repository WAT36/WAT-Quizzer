import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Box, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { MessageState, PullDownOptionState, WordMeanData } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { editEnglishWordMeanAPI } from '@/api/englishbot/editEnglishWordMeanAPI';

interface MeaningStackProps {
  id: string;
  posList: PullDownOptionState[];
  meanData: WordMeanData[];
  modalIsOpen: boolean;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setMeanData?: React.Dispatch<React.SetStateAction<WordMeanData[]>>;
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
        defaultValue={inputEditData?.partofspeechId || -1}
        label="partOfSpeech"
        key={i}
        sx={{ width: 1 }}
        onChange={(e) => {
          const inputtedData = Object.assign({}, inputEditData);
          inputtedData.partofspeechId = +e.target.value;
          // TODO データ構造から見直す必要ありか
          let posName = '';
          for (let i = 0; i < posList.length; i++) {
            if (+posList[i].value === +e.target.value) {
              posName = posList[i].label;
              break;
            }
          }
          inputtedData.partofspeechName = posName;
          if (setInputEditData) {
            setInputEditData(inputtedData);
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
  id,
  posList,
  meanData,
  modalIsOpen,
  setMessage,
  setModalIsOpen,
  setMeanData
}: MeaningStackProps) => {
  const emptyWordMeanData = {
    wordId: +id,
    wordName: '',
    wordmeanId: -1,
    meanId: -1,
    mean: '',
    partofspeechId: -1,
    partofspeechName: ''
  };
  const [inputEditData, setInputEditData] = useState<WordMeanData>(emptyWordMeanData);
  const [meanDataIndex, setMeanDataIndex] = useState<number>(-1);

  const handleOpen = (x: WordMeanData, index: number) => {
    setMeanDataIndex(index);
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
            {meanData.map((x, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={x.wordmeanId}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" sx={{ fontSize: 14 }} color="text.secondary" component="p">
                        {`[${x.partofspeechName}]`}
                      </Typography>
                      <Typography align="left" variant="h5" component="p">
                        {x.mean}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(x, index)}></Button>
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
                      ...emptyWordMeanData,
                      wordmeanId:
                        meanData.reduce(
                          (previousValue, currentValue) => Math.max(previousValue, currentValue.wordmeanId),
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
                    defaultValue={inputEditData?.mean || ''}
                    onChange={(e) => {
                      const inputtedData = Object.assign({}, inputEditData);
                      inputtedData.mean = e.target.value;
                      if (setInputEditData) {
                        setInputEditData(inputtedData);
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
                      meanData,
                      meanDataIndex,
                      inputEditData,
                      setMessage,
                      setModalIsOpen,
                      setMeanDataIndex,
                      setInputEditData,
                      setMeanData
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
