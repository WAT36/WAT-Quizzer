import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Box, CircularProgress, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { MessageState, PullDownOptionState } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  deleteEnglishMeanAPI,
  editEnglishWordMeanAPI,
  EditWordMeanAPIRequestDto,
  getWordDetailAPI,
  GetWordDetailAPIResponseDto
} from 'quizzer-lib';

interface MeaningStackProps {
  posList: PullDownOptionState[];
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

// 品詞プルダウン表示、「その他」だったら入力用テキストボックスを出す
const displayPosInput = (
  i: number,
  posList: PullDownOptionState[],
  editMeanData: EditWordMeanAPIRequestDto,
  setEditMeanData: React.Dispatch<React.SetStateAction<EditWordMeanAPIRequestDto>>
) => {
  return (
    <>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={editMeanData.partofspeechId || -1}
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
          if (posData) {
            setEditMeanData({
              ...editMeanData,
              partofspeechId: +posData.value
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

export const MeaningStack = ({ posList, wordDetail, setMessage, setWordDetail }: MeaningStackProps) => {
  // TODO 初期データはlibに持っていく
  const initEditMeanData = {
    wordId: -1,
    wordMeanId: -1,
    meanId: -1,
    partofspeechId: -1,
    meaning: ''
  };
  const [meaningModalopen, setMeaningModalOpen] = useState(false);
  const [editMeanData, setEditMeanData] = useState<EditWordMeanAPIRequestDto>(initEditMeanData);
  // TODO これいる？（sourcestackも）
  const [selectedMeanIndex, setSelectedMeanIndex] = useState<number>(-1); //仮

  const handleOpen = (wordMeanIndex: number) => {
    setMeaningModalOpen(true);
    setEditMeanData(
      wordMeanIndex === -1
        ? {
            wordId: wordDetail.id,
            wordMeanId:
              wordDetail.mean.reduce(
                (previousValue, currentValue) => Math.max(previousValue, currentValue.wordmean_id),
                -1
              ) + 1,
            meanId: -1,
            partofspeechId: -1,
            meaning: ''
          }
        : {
            wordId: wordDetail.id,
            wordMeanId: wordDetail.mean[wordMeanIndex].wordmean_id,
            meanId: wordDetail.mean[wordMeanIndex].id,
            partofspeechId: wordDetail.mean[wordMeanIndex].partsofspeech.id,
            meaning: wordDetail.mean[wordMeanIndex].meaning
          }
    );
    setSelectedMeanIndex(wordMeanIndex);
  };
  return (
    <>
      <Card variant="outlined" attr={'silver-card'}>
        <Typography align="left" variant="h4" component="p">
          {'意味'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          {wordDetail.id === -1 ? (
            <CircularProgress />
          ) : (
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
                        <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                      </Typography>
                    </Typography>
                  </Item>
                );
              })}
              {/* 意味の新規追加ボタン */}
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <IconButton onClick={(e) => handleOpen(-1)}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
              {/* TODO  このモーダルは別コンポーネントにしたい */}
              {/* 意味新規追加ボタン押すと出る意味編集モーダル */}
              <Modal isOpen={meaningModalopen} setIsOpen={setMeaningModalOpen}>
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h4" component="h4">
                    {'意味' + (selectedMeanIndex === -1 ? '追加' : '更新')}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    品詞：
                    {displayPosInput(1, posList, editMeanData, setEditMeanData)}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    意味：
                    <TextField
                      variant="outlined"
                      defaultValue={editMeanData.meaning || ''}
                      onChange={(e) => {
                        setEditMeanData({
                          ...editMeanData,
                          meaning: e.target.value
                        });
                      }}
                    />
                  </Typography>
                  <Button
                    label={'意味' + (selectedMeanIndex === -1 ? '追加' : '更新')}
                    attr={'button-array'}
                    variant="contained"
                    color="primary"
                    onClick={async (e) => {
                      setMeaningModalOpen(false);
                      const result = await editEnglishWordMeanAPI({ editMeanData });
                      setMessage && setMessage(result.message);
                      // TODO 成功時の判定法
                      // 更新確認後、単語の意味を再取得させる
                      if (result.message.messageColor === 'success.light') {
                        const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                          .result as GetWordDetailAPIResponseDto;
                        setWordDetail && setWordDetail(newWordDetail);
                      }
                      setEditMeanData(initEditMeanData);
                      setSelectedMeanIndex(-1);
                    }}
                  />
                  <Button
                    label={'意味削除'}
                    attr={'button-array'}
                    variant="contained"
                    color="primary"
                    disabled={selectedMeanIndex === -1}
                    onClick={async (e) => {
                      setMeaningModalOpen(false);
                      const result = await deleteEnglishMeanAPI({
                        deleteMeanData: {
                          meanId: editMeanData.meanId
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
                      setEditMeanData(initEditMeanData);
                      setSelectedMeanIndex(-1);
                    }}
                  />
                </Box>
              </Modal>
            </Stack>
          )}
        </Box>
      </Card>
    </>
  );
};
