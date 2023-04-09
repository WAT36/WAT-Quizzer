import React, { useEffect, useState } from 'react';

import EnglishBotLayout from './components/EnglishBotLayout';
import { get, post } from '../../common/API';
import { messageBoxStyle, buttonStyle } from '../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface SendToAddWordApiData {
  partOfSpeechId: number;
  meaning: string;
}

type messageColorType =
  | 'error'
  | 'initial'
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'textPrimary'
  | 'textSecondary'
  | undefined;

export default function EnglishBotAddWordPage() {
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<messageColorType>('initial');
  const [posList, setPosList] = useState<JSX.Element[]>([]);
  const [rowList, setRowList] = useState<JSX.Element[]>([]);
  const [inputWord, setInputWord] = useState<string>('');
  const [inputMeans, setInputMeans] = useState<[number, string][]>([]);

  useEffect(() => {
    getPartOfSpeechList();
  });

  const messeageClear = () => {
    setMessage('　');
    setMessageColor('initial');
  };

  // 品詞リスト取得
  const getPartOfSpeechList = () => {
    get('/english/partsofspeech', (data: any) => {
      if (data.status === 200) {
        data = data.body;
        let gotPosList = [];
        for (var i = 0; i < data.length; i++) {
          gotPosList.push(
            <MenuItem value={data[i].id} key={data[i].id}>
              {data[i].name}
            </MenuItem>
          );
        }
        setPosList(gotPosList);
      } else {
        setMessage('エラー:外部APIとの連携に失敗しました');
        setMessageColor('error');
      }
    });
  };

  // 列をステートに追加
  const setTableRow = () => {
    const newRowList = rowList;
    newRowList.push(getTableRow(rowList.length));
    setRowList(newRowList);
  };

  // テーブルi列目のJSXを返す
  const getTableRow = (i: number) => {
    return (
      <TableRow>
        <TableCell>
          <InputLabel id="demo-simple-select-label"></InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={-1}
            label="partOfSpeech"
            key={i}
            sx={{ width: 1 }}
            onChange={(e) => {
              changeSelect(String(e.target.value), i, false);
            }}
          >
            <MenuItem value={-1} key={-1}>
              選択なし
            </MenuItem>
            {posList}
          </Select>
        </TableCell>
        <TableCell>
          <TextField
            id="input-mean-01"
            label="意味"
            variant="outlined"
            key={i}
            sx={{ width: 1 }}
            onChange={(e) => {
              changeSelect(e.target.value, i, true);
            }}
          />
        </TableCell>
      </TableRow>
    );
  };

  // 列を追加
  const addRow = () => {
    messeageClear();
    setTableRow();
  };

  // 列を表示(JSXを取得)
  const displayRow = () => {
    return rowList.map((value) => {
      return value;
    });
  };

  // 意味リスト([品詞,意味])への入力の更新
  const changeSelect = (value: string, i: number, isMean: boolean) => {
    if (i >= inputMeans.length) {
      while (i >= inputMeans.length) {
        inputMeans.push([-1, '']);
      }
    }
    inputMeans[i] = isMean ? [inputMeans[i][0], value] : [Number(value), inputMeans[i][1]];
  };

  // 入力した単語名の更新
  const inputWordName = (value: string) => {
    messeageClear();
    setInputWord(value);
  };

  // 登録ボタン押下後。単語と意味をDBに登録
  const addWord = () => {
    if (inputWord === '') {
      setMessage('エラー:単語が入力されておりません');
      setMessageColor('error');
      return;
    }

    for (let i = 0; i < inputMeans.length; i++) {
      if (inputMeans[i][0] === -1) {
        setMessage(`エラー:${i + 1}行目の品詞を入力してください`);
        setMessageColor('error');
        return;
      } else if (inputMeans[i][1] === '') {
        setMessage(`エラー:${i + 1}行目の意味を入力してください`);
        setMessageColor('error');
        return;
      }
    }

    post(
      '/english/word/add',
      {
        wordName: inputWord,
        pronounce: '',
        meanArrayData: inputMeans.reduce((previousValue: SendToAddWordApiData[], currentValue) => {
          if (currentValue[0] >= 0) {
            previousValue.push({
              partOfSpeechId: currentValue[0],
              meaning: currentValue[1]
            });
          }
          return previousValue;
        }, [])
      },
      (data: any) => {
        if (data.status === 200) {
          setMessage(`単語「${inputWord}」を登録しました`);
          setMessageColor('initial');
          setInputWord('');
          setRowList([]);
          setInputMeans([]);
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      }
    );
  };

  const contents = () => {
    return (
      <Container>
        <h1>Add Word</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={messageColor}>
              {message}
            </Typography>
          </CardContent>
        </Card>

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

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 200 }}>{'品詞'}</TableCell>
                  <TableCell>{'意味'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{displayRow()}</TableBody>
            </Table>
          </TableContainer>
          <IconButton aria-label="delete" sx={{ margin: 'auto' }} onClick={addRow}>
            <AddCircleOutlineIcon />
          </IconButton>
        </FormGroup>
      </Container>
    );
  };

  return (
    <>
      <EnglishBotLayout contents={contents()} />
    </>
  );
}
