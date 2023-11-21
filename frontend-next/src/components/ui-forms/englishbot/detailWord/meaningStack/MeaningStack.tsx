import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Box, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import styles from './MeaningStack.module.css';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { EditWordMeanData, MessageState, PullDownOptionState, WordMeanData } from '../../../../../../interfaces/state';
import { EditEnglishWordMeanButton } from '@/components/ui-parts/button-patterns/editEnglishWordMean/EditEnglishWordMean.button';

interface MeaningStackProps {
  id: string;
  posList: PullDownOptionState[];
  sourceList: PullDownOptionState[];
  meanData: WordMeanData[];
  modalIsOpen: boolean;
  inputEditData?: EditWordMeanData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setInputEditData?: React.Dispatch<React.SetStateAction<EditWordMeanData | undefined>>;
}

// 品詞プルダウン表示、「その他」だったら入力用テキストボックスを出す
const displayPosInput = (
  i: number,
  posList: PullDownOptionState[],
  inputEditData?: EditWordMeanData,
  setInputEditData?: React.Dispatch<React.SetStateAction<EditWordMeanData | undefined>>
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
          inputtedData.partofspeechId = Number(e.target.value);
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

// 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
const displaySourceInput = (
  i: number,
  sourceList: PullDownOptionState[],
  inputEditData?: EditWordMeanData,
  setInputEditData?: React.Dispatch<React.SetStateAction<EditWordMeanData | undefined>>
) => {
  return (
    <>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={inputEditData?.sourceId || -1}
        label="source"
        key={i}
        sx={{ width: 1 }}
        onChange={(e) => {
          const inputtedData = Object.assign({}, inputEditData);
          inputtedData.sourceId = Number(e.target.value);
          if (setInputEditData) {
            setInputEditData(inputtedData);
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

export const MeaningStack = ({
  id,
  posList,
  sourceList,
  meanData,
  modalIsOpen,
  inputEditData,
  setMessage,
  setModalIsOpen,
  setInputEditData
}: MeaningStackProps) => {
  const handleOpen = (x: WordMeanData) => {
    if (setModalIsOpen) {
      setModalIsOpen(true);
    }
    if (setInputEditData) {
      setInputEditData({
        wordId: +id,
        wordmeanId: x.wordmeanId,
        meanId: x.meanId,
        partofspeechId: x.partofspeechId,
        mean: x.mean,
        sourceId: x.sourceId
      });
    }
  };
  return (
    <>
      <Card variant="outlined">
        <Typography align="left" variant="h4" component="p">
          {'意味'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          <Stack spacing={2}>
            {meanData.map((x) => {
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
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(x)}></Button>
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
              <Box className={styles.mordalBox}>
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
                    defaultValue={inputEditData!.mean}
                    onChange={(e) => {
                      const inputtedData = Object.assign({}, inputEditData);
                      inputtedData.mean = e.target.value;
                      if (setInputEditData) {
                        setInputEditData(inputtedData);
                      }
                    }}
                  />
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  出典：
                  {displaySourceInput(3, sourceList, inputEditData, setInputEditData)}
                </Typography>
                <EditEnglishWordMeanButton
                  inputEditData={inputEditData}
                  setMessage={setMessage}
                ></EditEnglishWordMeanButton>
              </Box>
            </Modal>
          </Stack>
        </Box>
      </Card>
    </>
  );
};
