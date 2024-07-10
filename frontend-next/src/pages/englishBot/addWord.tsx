import React, { useEffect, useState } from 'react';
import { Container, FormGroup } from '@mui/material';
import { AddWordAPIRequestDto } from 'quizzer-lib';
import { Layout } from '@/components/templates/layout/Layout';
import { PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { AddMeanForm } from '@/components/ui-forms/englishbot/addWord/addMeanForm/AddMeanForm';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { getSourceListAPI } from '@/api/englishbot/getSourceListAPI';
import { getPartOfSpeechListAPI } from '@/api/englishbot/getPartOfSpeechListAPI';
import { InputAddWordForm } from '@/components/ui-forms/englishbot/addWord/inputAddWordForm/InputAddWordForm';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotAddWordPage({ isMock }: Props) {
  const setMessage = useSetRecoilState(messageState);
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourceList, setSourceList] = useState<PullDownOptionState[]>([]);

  const [addWordState, setAddWordState] = useState<AddWordAPIRequestDto>({
    inputWord: {
      wordName: '',
      sourceId: -1,
      subSourceName: ''
    },
    pronounce: '',
    meanArrayData: []
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
        <FormGroup>
          <InputAddWordForm
            sourceList={sourceList}
            setMessage={setMessage}
            addWordState={addWordState}
            setAddWordState={setAddWordState}
          />
          <AddMeanForm posList={posList} addWordState={addWordState} setAddWordState={setAddWordState} />
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
