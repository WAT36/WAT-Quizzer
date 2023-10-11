import React, { memo, useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import { buttonStyle, messageBoxStyle, typoStyles } from '../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { addQuizDto } from '../../../interfaces/api/response';
import { AddQuizApiResponse, ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizFileApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// タブ内コンテンツの中身、別コンポーネント化
// eslint-disable-next-line react/display-name
const CustomTabPanel = memo<TabPanelProps>((props: TabPanelProps) => {
  const { children, value, index } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <>{children}</>}
    </div>
  );
});

export default function AddQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [input_data, setInputData] = useState<addQuizDto>({});
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');
  const [addLog, setAddLog] = useState<string>();
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get('/quiz/file', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const res: QuizFileApiResponse[] = data.body as QuizFileApiResponse[];
        let filelist = [];
        for (var i = 0; i < res.length; i++) {
          filelist.push(
            <MenuItem value={res[i].file_num} key={res[i].file_num}>
              {res[i].file_nickname}
            </MenuItem>
          );
        }
        setFilelistoption(filelist);
        setMessage('　');
        setMessageColor('common.black');
      } else {
        setMessage('エラー:外部APIとの連携に失敗しました');
        setMessageColor('error');
      }
    });
  }, []);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setFileNum(e.target.value as number);
  };

  const addQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    } else if (!input_data.question || !input_data.answer) {
      setMessage('エラー:追加する問題文・正解を入力して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
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
            setMessage('Success!! 問題を追加できました!');
            setMessageColor('success.light');
            setAddLog(res[0].result);
            setInputData({});
            //入力データをクリア
            const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
            if (inputQuizField) {
              inputQuizField.value = '';
            }
          } else {
            setMessage('エラー:外部APIとの連携に失敗しました');
            setMessageColor('error');
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
            setMessage('Success!! 問題を追加できました!');
            setMessageColor('success.light');
            setAddLog(res[0].result);
            setInputData({});
            //入力データをクリア
            const inputQuizField = document.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
            if (inputQuizField) {
              inputQuizField.value = '';
            }
          } else {
            setMessage('エラー:外部APIとの連携に失敗しました');
            setMessageColor('error');
          }
        }
      );
    }
  };

  // 入力データを登録
  const updateInputData = (attrName: string, value: string) => {
    setInputData((prev) => ({
      ...prev,
      [attrName]: value
    }));
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
        <h1>WAT Quizzer</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={messageColor}>
              {message}
            </Typography>
          </CardContent>
        </Card>

        <FormGroup>
          <FormControl>
            <InputLabel id="quiz-file-input">問題ファイル</InputLabel>
            <Select
              labelId="quiz-file-name"
              id="quiz-file-id"
              defaultValue={-1}
              // value={age}
              onChange={(e) => selectedFileChange(e)}
            >
              <MenuItem value={-1} key={-1}>
                選択なし
              </MenuItem>
              {filelistoption}
            </Select>
          </FormControl>

          <Card variant="outlined">
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="基礎問題" {...a11yProps(0)} />
              <Tab label="応用問題" {...a11yProps(1)} />
              <Tab label="四択問題" {...a11yProps(2)} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <CardContent>
                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  追加する基礎問題（問題文,正解,カテゴリ,画像ファイル名）
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  問題文　：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.question || ''}
                    onChange={(e) => updateInputData('question', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  答え　　：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.answer || ''}
                    onChange={(e) => updateInputData('answer', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  カテゴリ：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.category || ''}
                    onChange={(e) => updateInputData('category', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  画像ファイル名：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.img_file || ''}
                    onChange={(e) => updateInputData('img_data', e.target.value)}
                  />
                </Typography>
              </CardContent>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <CardContent>
                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  追加する応用問題（問題文,正解,画像ファイル名,関連基礎問題番号）
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  応用問題文　：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.question || ''}
                    onChange={(e) => updateInputData('question', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  応用問題の答え　　：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.answer || ''}
                    onChange={(e) => updateInputData('answer', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={{ ...messageBoxStyle, visibility: 'hidden' }}>
                  カテゴリ：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.category || ''}
                    onChange={(e) => updateInputData('category', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  画像ファイル名：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.img_file || ''}
                    onChange={(e) => updateInputData('img_data', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  関連基礎問題番号(カンマ区切りで問題番号を指定)：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.matched_basic_quiz_id || ''}
                    onChange={(e) => updateInputData('matched_basic_quiz_id', e.target.value)}
                  />
                </Typography>
              </CardContent>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <CardContent>
                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  追加する四択問題（問題文,正解,カテゴリ,画像ファイル名）
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  問題文　：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.question || ''}
                    onChange={(e) => updateInputData('question', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  正解　　：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.answer || ''}
                    onChange={(e) => updateInputData('answer', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={{ ...messageBoxStyle, visibility: 'hidden' }}>
                  カテゴリ：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.category || ''}
                    onChange={(e) => updateInputData('category', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  画像ファイル名：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.img_file || ''}
                    onChange={(e) => updateInputData('img_data', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  関連基礎問題番号(カンマ区切りで問題番号を指定)：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.matched_basic_quiz_id || ''}
                    onChange={(e) => updateInputData('matched_basic_quiz_id', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  ダミー選択肢1：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.dummy1 || ''}
                    onChange={(e) => updateInputData('dummy1', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  ダミー選択肢2：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.dummy2 || ''}
                    onChange={(e) => updateInputData('dummy2', e.target.value)}
                  />
                </Typography>

                <Typography variant="h6" component="h6" style={messageBoxStyle}>
                  ダミー選択肢3：
                  <Input
                    fullWidth
                    maxRows={1}
                    value={input_data.dummy3 || ''}
                    onChange={(e) => updateInputData('dummy3', e.target.value)}
                  />
                </Typography>
              </CardContent>
            </CustomTabPanel>
          </Card>
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => addQuiz()}>
          送信
        </Button>

        <Card variant="outlined">
          <CardContent>
            <Typography style={typoStyles} color="textSecondary" gutterBottom>
              --実行ログ--
            </Typography>
            <Typography variant="h6" component="h6">
              {addLog}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題追加'} />
    </>
  );
}
