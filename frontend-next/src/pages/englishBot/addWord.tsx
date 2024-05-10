import React, { useEffect, useState } from 'react';
import { buttonStyle } from '../../styles/Pages';
import { Button, Container, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { meanOfAddWordDto } from 'quizzer-lib';
import { Layout } from '@/components/templates/layout/Layout';
import { InputAddWordState, PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { AddMeanForm } from '@/components/ui-forms/englishbot/addWord/addMeanForm/AddMeanForm';
import { messageState } from '@/atoms/Message';
import { useRecoilState } from 'recoil';
import { addWordAPI } from '@/api/englishbot/addWordAPI';
import { getSourceListAPI } from '@/api/englishbot/getSourceListAPI';
import { getPartOfSpeechListAPI } from '@/api/englishbot/getPartOfSpeechListAPI';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotAddWordPage({ isMock }: Props) {
  const [message, setMessage] = useRecoilState(messageState);
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourceList, setSourceList] = useState<PullDownOptionState[]>([]);
  const [meanRowList, setMeanRowList] = useState<meanOfAddWordDto[]>([]);
  const [inputWord, setInputWord] = useState<InputAddWordState>({
    wordName: '',
    sourceId: -1,
    subSourceName: ''
  });

  useEffect(() => {
    !isMock &&
      Promise.all([getPartOfSpeechListAPI(setMessage, setPosList), getSourceListAPI(setMessage, setSourceList)]);
  }, [isMock, setMessage]);

  // 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displaySourceInput = () => {
    const sourceInput =
      inputWord.sourceId === -2 ? (
        <>
          <TextField
            id="input-pos-01"
            label="出典"
            variant="outlined"
            key="addWordInputSource"
            sx={{ width: 1 }}
            onChange={(e) => {
              setInputWord({
                ...inputWord,
                newSourceName: e.target.value
              });
            }}
          />
        </>
      ) : (
        <></>
      );

    return (
      <>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={-1}
          label="source"
          key="source"
          sx={{ width: 1 }}
          onChange={(e) => {
            setInputWord({
              ...inputWord,
              sourceId: +e.target.value
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
        {sourceInput}
      </>
    );
  };

  const contents = () => {
    return (
      <Container>
        <Title label="Add Word"></Title>
        <Button
          variant="contained"
          style={buttonStyle}
          onClick={(e) => addWordAPI({ inputWord, meanRowList, setMessage, setInputWord, setMeanRowList })}
        >
          登録
        </Button>
        <FormGroup>
          <FormControl>
            <TextField
              fullWidth
              label="New Word"
              id="newWord"
              value={inputWord.wordName}
              onChange={(e) =>
                setInputWord({
                  ...inputWord,
                  wordName: e.target.value
                })
              }
            />
            <InputLabel id="demo-simple-select-label"></InputLabel>
            {displaySourceInput()}
            <TextField
              fullWidth
              label="サブ出典"
              id="subSource"
              value={inputWord.subSourceName}
              onChange={(e) =>
                setInputWord({
                  ...inputWord,
                  subSourceName: e.target.value
                })
              }
            />
          </FormControl>

          <AddMeanForm
            posList={posList}
            sourceList={sourceList}
            meanRowList={meanRowList}
            setMeanRowList={setMeanRowList}
          />
        </FormGroup>
      </Container>
    );
  };

  return (
    <>
      <Layout mode="englishBot" contents={contents()} title={'単語追加'} />
    </>
  );
}
