import React, { useEffect, useState } from 'react';
import { post } from '../../common/API';
import { buttonStyle } from '../../styles/Pages';
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  TextField
} from '@mui/material';
import { SendToAddWordApiData, meanOfAddWordDto } from '../../../interfaces/api/response';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getPartOfSpeechList, getSourceList } from '@/common/response';
import { AddMeanForm } from '@/components/ui-forms/englishbot/addWord/addMeanForm/AddMEanForm';

export default function EnglishBotAddWordPage() {
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourceList, setSourceList] = useState<PullDownOptionState[]>([]);
  const [meanRowList, setMeanRowList] = useState<meanOfAddWordDto[]>([]);
  const [inputWord, setInputWord] = useState<string>('');

  useEffect(() => {
    Promise.all([getPartOfSpeechList(setMessage, setPosList), getSourceList(setMessage, setSourceList)]);
  }, []);

  const messeageClear = () => {
    setMessage({
      message: '　',
      messageColor: 'common.black'
    });
  };

  // 入力した単語名の更新
  const inputWordName = (value: string) => {
    messeageClear();
    setInputWord(value);
  };

  // 登録ボタン押下後。単語と意味をDBに登録
  const addWord = async () => {
    if (inputWord === '') {
      setMessage({
        message: 'エラー:単語が入力されておりません',
        messageColor: 'error'
      });
      return;
    }

    for (let i = 0; i < meanRowList.length; i++) {
      if (meanRowList[i].pos.id === -1 || (meanRowList[i].pos.id === -2 && !meanRowList[i].pos.name)) {
        setMessage({
          message: `エラー:${i + 1}行目の品詞を入力してください`,
          messageColor: 'error'
        });
        return;
      } else if (!meanRowList[i].mean || meanRowList[i].mean === '') {
        setMessage({
          message: `エラー:${i + 1}行目の意味を入力してください`,
          messageColor: 'error'
        });
        return;
      }
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    await post(
      '/english/word/add',
      {
        wordName: inputWord,
        pronounce: '',
        meanArrayData: meanRowList.reduce((previousValue: SendToAddWordApiData[], currentValue) => {
          if (currentValue.pos.id !== -1) {
            previousValue.push({
              partOfSpeechId: currentValue.pos.id,
              sourceId: currentValue.source.id,
              meaning: currentValue.mean || '',
              partOfSpeechName: currentValue.pos.name,
              sourceName: currentValue.source.name
            });
          }
          return previousValue;
        }, [])
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: `単語「${inputWord}」を登録しました`,
            messageColor: 'success.light'
          });
          setInputWord('');
          setMeanRowList([]);
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      }
    ).catch((err) => {
      console.error(`API Error2(word add). ${JSON.stringify(err)},err:${err}`);
      setMessage({
        message: 'エラー:外部APIとの連携に失敗しました',
        messageColor: 'error',
        isDisplay: true
      });
    });
  };

  const contents = () => {
    return (
      <Container>
        <Title label="Add Word"></Title>
        <Button variant="contained" style={buttonStyle} onClick={addWord}>
          登録
        </Button>
        <FormGroup>
          <FormControl>
            <TextField
              fullWidth
              label="New Word"
              id="newWord"
              value={inputWord}
              onChange={(e) => inputWordName(e.target.value)}
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
