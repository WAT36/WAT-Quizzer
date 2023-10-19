import React, { useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import { buttonStyle } from '../../styles/Pages';
import {
  Button,
  Card,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs
} from '@mui/material';
import { addQuizDto } from '../../../interfaces/api/response';
import { AddQuizApiResponse, ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizFileApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { AddQuizLogSection } from '@/components/ui-forms/quizzer/addQuiz/addQuizLogSection/AddQuizLogSection';
import { MessageCard } from '@/components/ui-parts/messageCard/MessageCard';
import { Title } from '@/components/ui-elements/title/Title';
import { BasisTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/basisTabPanel/Basis.tabpanel';
import { AppliedTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/appliedTabPanel/Applied.tabpanel';
import { FourChoiceTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/fourChoiceTabPanel/FourChoice.tabpanel';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { getFileList } from '@/common/response';

export default function AddQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [input_data, setInputData] = useState<addQuizDto>({});
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });
  const [addLog, setAddLog] = useState<string>('');
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);

  const [value, setValue] = React.useState(0);

  // 問題ファイルリスト取得
  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setFileNum(e.target.value as number);
  };

  const addQuiz = () => {
    if (file_num === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error'
      });
      return;
    } else if (!input_data.question || !input_data.answer) {
      setMessage({
        message: 'エラー:追加する問題文・正解を入力して下さい',
        messageColor: 'error'
      });
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    // 基礎問題のとき(value==0)
    if (value === 0) {
      post(
        '/quiz/add',
        {
          file_num,
          input_data
        },
        (data: ProcessingApiReponse) => {
          if (data.status === 200 || data.status === 201) {
            const res: AddQuizApiResponse[] = data.body as AddQuizApiResponse[];
            setMessage({
              message: 'Success!! 問題を追加できました!',
              messageColor: 'success.light'
            });
            setAddLog(res[0].result);
            setInputData({});
            //入力データをクリア
            const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
            if (inputQuizField) {
              inputQuizField.value = '';
            }
          } else {
            setMessage({
              message: 'エラー:外部APIとの連携に失敗しました',
              messageColor: 'error'
            });
          }
        }
      );
    } else if (value === 1) {
      // 応用問題の時(value===1)
      post(
        '/quiz/advanced',
        {
          file_num,
          input_data
        },
        (data: ProcessingApiReponse) => {
          if (data.status === 200 || data.status === 201) {
            const res: AddQuizApiResponse[] = data.body as AddQuizApiResponse[];
            setMessage({
              message: 'Success!! 問題を追加できました!',
              messageColor: 'success.light'
            });
            setAddLog(res[0].result);
            setInputData({});
            //入力データをクリア
            const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
            if (inputQuizField) {
              inputQuizField.value = '';
            }
          } else {
            setMessage({
              message: 'エラー:外部APIとの連携に失敗しました',
              messageColor: 'error'
            });
          }
        }
      );
    } else if (value === 2) {
      // 四択問題の時(value===2)
      post(
        '/quiz/advanced/4choice',
        {
          file_num,
          input_data
        },
        (data: ProcessingApiReponse) => {
          if (data.status === 200 || data.status === 201) {
            const res: AddQuizApiResponse[] = data.body as AddQuizApiResponse[];
            setMessage({
              message: 'Success!! 問題を追加できました!',
              messageColor: 'success.light'
            });
            setAddLog(res[0].result);
            setInputData({});
            //入力データをクリア
            const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
            if (inputQuizField) {
              inputQuizField.value = '';
            }
          } else {
            setMessage({
              message: 'エラー:外部APIとの連携に失敗しました',
              messageColor: 'error'
            });
          }
        }
      );
    }
  };

  // タブ内コンテンツの設定
  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  };

  // タブの切り替え
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setInputData({});
  };

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <MessageCard messageState={message}></MessageCard>

        <FormGroup>
          <FormControl>
            <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
          </FormControl>

          <Card variant="outlined">
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="基礎問題" {...a11yProps(0)} />
              <Tab label="応用問題" {...a11yProps(1)} />
              <Tab label="四択問題" {...a11yProps(2)} />
            </Tabs>
            <BasisTabPanel value={value} index={0} inputData={input_data} setInputData={setInputData} />
            <AppliedTabPanel value={value} index={1} inputData={input_data} setInputData={setInputData} />
            <FourChoiceTabPanel value={value} index={2} inputData={input_data} setInputData={setInputData} />
          </Card>
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => addQuiz()}>
          送信
        </Button>

        <AddQuizLogSection log={addLog} />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題追加'} />
    </>
  );
}
