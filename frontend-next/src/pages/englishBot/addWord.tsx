import React, { useEffect, useState } from 'react';
import { buttonStyle } from '../../styles/Pages';
import { Button, Container, FormControl, FormGroup, TextField } from '@mui/material';
import { meanOfAddWordDto } from '../../../interfaces/api/response';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getPartOfSpeechList, getSourceList } from '@/common/response';
import { AddMeanForm } from '@/components/ui-forms/englishbot/addWord/addMeanForm/AddMeanForm';
import { addWordAPI } from '@/common/ButtonAPI';

export default function EnglishBotAddWordPage() {
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourceList, setSourceList] = useState<PullDownOptionState[]>([]);
  const [meanRowList, setMeanRowList] = useState<meanOfAddWordDto[]>([]);
  const [inputWord, setInputWord] = useState<string>('');

  useEffect(() => {
    Promise.all([getPartOfSpeechList(setMessage, setPosList), getSourceList(setMessage, setSourceList)]);
  }, []);

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
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
            />
          </FormControl>

          <AddMeanForm
            posList={posList}
            sourceList={sourceList}
            meanRowList={meanRowList}
            setMessage={setMessage}
            setMeanRowList={setMeanRowList}
          />
        </FormGroup>
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="englishBot"
        contents={contents()}
        title={'単語追加'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
