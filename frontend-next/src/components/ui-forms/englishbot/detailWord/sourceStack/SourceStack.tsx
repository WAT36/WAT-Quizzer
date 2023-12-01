import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import { MessageState, PullDownOptionState, WordMeanData, WordSourceData } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useState } from 'react';
import { EditEnglishWordSourceButton } from '@/components/ui-parts/button-patterns/editEnglishWordSource/EditEnglishWordSource.button';

interface SourceStackProps {
  meanData: WordMeanData[];
  sourceList: PullDownOptionState[];
  wordSourceData: WordSourceData[];
  modalIsOpen: boolean;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setWordSourceData?: React.Dispatch<React.SetStateAction<WordSourceData[]>>;
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
            console.log(`e.target.value:${e.target.value}`);
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
  meanData,
  sourceList,
  wordSourceData,
  modalIsOpen,
  setModalIsOpen,
  setMessage,
  setWordSourceData
}: SourceStackProps) => {
  const [selectedWordSourceIndex, setSelectedWordSourceIndex] = useState<number>(-1); //仮
  const [inputSourceId, setInputSourceId] = useState<number>(-1);

  const handleOpen = (x: WordSourceData, index: number) => {
    if (setModalIsOpen) {
      setModalIsOpen(true);
    }
    setSelectedWordSourceIndex(index);
    setInputSourceId(x.sourceId);
  };
  return (
    <>
      <Card variant="outlined">
        <Typography align="left" variant="h4" component="p">
          {'出典'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          <Stack spacing={2}>
            {wordSourceData.map((x, index) => {
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
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(x, index)} />
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  出典編集
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  出典：
                  {displaySourceInput(3, sourceList, inputSourceId, setInputSourceId)}
                </Typography>
                <EditEnglishWordSourceButton
                  meanData={meanData}
                  sourceList={sourceList}
                  wordSourceData={wordSourceData}
                  selectedWordSourceIndex={selectedWordSourceIndex}
                  inputSourceId={inputSourceId}
                  setMessage={setMessage}
                  setModalIsOpen={setModalIsOpen}
                  setWordSourceData={setWordSourceData}
                />
              </Box>
            </Modal>
          </Stack>
        </Box>
      </Card>
    </>
  );
};
