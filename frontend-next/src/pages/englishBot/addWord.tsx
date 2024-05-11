import React, { useEffect, useState } from 'react';
import { buttonStyle } from '../../styles/Pages';
import { Button, Container, FormGroup } from '@mui/material';
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
import { InputAddWordForm } from '@/components/ui-forms/englishbot/addWord/inputAddWordForm/InputAddWordForm';

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

  // TODO  単語登録入力のとこは別コンポーネントにして切り出す
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
          <InputAddWordForm inputWord={inputWord} sourceList={sourceList} setInputWord={setInputWord} />
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
