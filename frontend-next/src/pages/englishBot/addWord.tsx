import React, { useEffect, useState } from 'react';
import { Container, FormGroup } from '@mui/material';
import {
  AddWordAPIRequestDto,
  apiResponsePullDownAdapter,
  getPartOfSpeechListAPI,
  getSourceListAPI,
  PartofSpeechApiResponse,
  PullDownOptionDto,
  SourceApiResponse
} from 'quizzer-lib';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { AddMeanForm } from '@/components/ui-forms/englishbot/addWord/addMeanForm/AddMeanForm';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { InputAddWordForm } from '@/components/ui-forms/englishbot/addWord/inputAddWordForm/InputAddWordForm';

type Props = {
  isMock?: boolean;
};

export default function EnglishBotAddWordPage({ isMock }: Props) {
  const setMessage = useSetRecoilState(messageState);
  const [posList, setPosList] = useState<PullDownOptionDto[]>([]);
  const [sourceList, setSourceList] = useState<PullDownOptionDto[]>([]);

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
      Promise.all([
        (async () => {
          const result = await getPartOfSpeechListAPI();
          result.result && setPosList(apiResponsePullDownAdapter(result.result as PartofSpeechApiResponse[]));
        })(),
        (async () => {
          const result = await getSourceListAPI();
          result.result && setSourceList(apiResponsePullDownAdapter(result.result as SourceApiResponse[]));
        })()
      ]);
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
