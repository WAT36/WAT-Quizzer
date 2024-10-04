import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, CircularProgress, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  Message,
  deleteEnglishWordSourceAPI,
  editEnglishWordSourceAPI,
  EditWordSourceAPIRequestDto,
  getWordDetailAPI,
  GetWordDetailAPIResponseDto,
  PullDownOptionDto
} from 'quizzer-lib';

interface SourceStackProps {
  sourceList: PullDownOptionDto[];
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

// 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
const displaySourceInput = (
  i: number, // TODO iはキーだけ使ってるんでuuidとかで代用できるので消す
  sourceList: PullDownOptionDto[],
  editWordSourceData: EditWordSourceAPIRequestDto,
  setEditWordSourceData: React.Dispatch<React.SetStateAction<EditWordSourceAPIRequestDto>>
) => {
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      defaultValue={editWordSourceData.oldSourceId || -1}
      label="source"
      key={i}
      sx={{ width: 1 }}
      onChange={(e) => {
        setEditWordSourceData({
          ...editWordSourceData,
          newSourceId: +e.target.value
        });
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
  );
};

export const SourceStack = ({ sourceList, wordDetail, setMessage, setWordDetail }: SourceStackProps) => {
  // TODO 初期データはlibに持っていく
  const initEditWordSourceData = {
    wordId: -1,
    oldSourceId: -1,
    newSourceId: -1
  };
  // TODO word-sourceの構造変えたらここも直したい
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [editWordSourceData, setEditWordSourceData] = useState<EditWordSourceAPIRequestDto>(initEditWordSourceData);
  const [selectedWordSourceIndex, setSelectedWordSourceIndex] = useState<number>(-1); //仮

  const handleOpen = (index: number) => {
    setSourceModalOpen(true);
    setSelectedWordSourceIndex(index);
    setEditWordSourceData({
      wordId: wordDetail.id,
      oldSourceId: index === -1 ? index : wordDetail.word_source[index].source.id,
      newSourceId: index === -1 ? index : wordDetail.word_source[index].source.id
    });
  };
  return (
    <Card variant="outlined" attr={'silver-card'}>
      <Typography align="left" variant="h4" component="p">
        {'出典'}
      </Typography>
      <Box sx={{ width: '100%', padding: '4px' }}>
        {wordDetail.id === -1 ? (
          <CircularProgress />
        ) : (
          <Stack spacing={2}>
            {wordDetail.word_source.map((x, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={index}>
                  <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="div">
                      <Typography align="left" variant="h5" component="p">
                        {x.source.name}
                      </Typography>
                    </Typography>
                    <Typography component="div" sx={{ marginLeft: 'auto' }}>
                      <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)} />
                    </Typography>
                  </Typography>
                </Item>
              );
            })}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <IconButton onClick={(e) => handleOpen(-1)}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>
            <Modal isOpen={sourceModalOpen} setIsOpen={setSourceModalOpen}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4" component="h4">
                  {'出典' + (selectedWordSourceIndex === -1 ? '追加' : '更新')}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  出典：
                  {displaySourceInput(3, sourceList, editWordSourceData, setEditWordSourceData)}
                </Typography>
                <Button
                  label={'出典' + (selectedWordSourceIndex === -1 ? '追加' : '更新')}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  onClick={async (e) => {
                    setSourceModalOpen(false);
                    const result = await editEnglishWordSourceAPI({
                      editWordSourceData
                    });
                    setMessage && setMessage(result.message);
                    // TODO 成功時の判定法
                    // 更新確認後、単語の意味を再取得させる
                    if (result.message.messageColor === 'success.light') {
                      const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                        .result as GetWordDetailAPIResponseDto;
                      setWordDetail && setWordDetail(newWordDetail);
                    }
                    setEditWordSourceData(initEditWordSourceData);
                    setSelectedWordSourceIndex(-1);
                  }}
                />
                <Button
                  label={'出典削除'}
                  attr={'button-array'}
                  variant="contained"
                  color="primary"
                  disabled={selectedWordSourceIndex === -1}
                  onClick={async (e) => {
                    setSourceModalOpen(false);
                    const result = await deleteEnglishWordSourceAPI({
                      deleteWordSourceData: {
                        word_id: wordDetail.id,
                        source_id: wordDetail.word_source[selectedWordSourceIndex].source.id
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
                    setEditWordSourceData(initEditWordSourceData);
                    setSelectedWordSourceIndex(-1);
                  }}
                />
              </Box>
            </Modal>
          </Stack>
        )}
      </Box>
    </Card>
  );
};
