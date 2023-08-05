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
import { SendToAddWordApiData, meanOfAddWordDto } from './dto/addWordDto';

export default function EnglishBotAddWordPage() {
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');
  const [posList, setPosList] = useState<JSX.Element[]>([]);
  const [sourceList, setSourceList] = useState<JSX.Element[]>([]);
  const [meanRowList, setMeanRowList] = useState<meanOfAddWordDto[]>([]);
  const [inputWord, setInputWord] = useState<string>('');

  useEffect(() => {
    Promise.all([getPartOfSpeechList(), getSourceList()]);
  }, []);

  const messeageClear = () => {
    setMessage('　');
    setMessageColor('common.black');
  };

  // 品詞リスト取得
  const getPartOfSpeechList = async () => {
    setMessage('通信中...');
    setMessageColor('#d3d3d3');
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
        gotPosList.push(
          <MenuItem value={-2} key={-2}>
            {'その他'}
          </MenuItem>
        );
        setPosList(gotPosList);
        setMessage('　');
        setMessageColor('common.black');
      } else {
        setMessage('エラー:外部APIとの連携に失敗しました');
        setMessageColor('error');
      }
    });
  };

  // 出典リスト取得
  const getSourceList = async () => {
    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get('/english/source', (data: any) => {
      if (data.status === 200) {
        data = data.body;
        let gotSourceList = [];
        for (var i = 0; i < data.length; i++) {
          gotSourceList.push(
            <MenuItem value={data[i].id} key={data[i].id}>
              {data[i].name}
            </MenuItem>
          );
        }
        gotSourceList.push(
          <MenuItem value={-2} key={-2}>
            {'その他'}
          </MenuItem>
        );
        setSourceList(gotSourceList);
        setMessage('　');
        setMessageColor('common.black');
      } else {
        setMessage('エラー:外部APIとの連携に失敗しました');
        setMessageColor('error');
      }
    });
  };

  // 列をステートに追加
  const setTableRow = () => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList.push({
      pos: {
        id: -1,
        name: undefined
      },
      source: {
        id: -1,
        name: undefined
      },
      mean: undefined
    });
    setMeanRowList(copyMeanRowList);
  };

  // 品詞プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displayPosInput = (i: number) => {
    const posInput =
      meanRowList[i] && meanRowList[i].pos.id === -2 ? (
        <>
          <TextField
            id="input-pos-01"
            label="品詞"
            variant="outlined"
            key={i}
            sx={{ width: 1 }}
            onChange={(e) => {
              inputPos(e.target.value, i);
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
          label="partOfSpeech"
          key={i}
          sx={{ width: 1 }}
          onChange={(e) => {
            changePosSelect(String(e.target.value), i);
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {posList}
        </Select>
        {posInput}
      </>
    );
  };

  // 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displaySourceInput = (i: number) => {
    const sourceInput =
      meanRowList[i] && meanRowList[i].source.id === -2 ? (
        <>
          <TextField
            id="input-pos-01"
            label="出典"
            variant="outlined"
            key={i}
            sx={{ width: 1 }}
            onChange={(e) => {
              inputSource(e.target.value, i);
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
          key={i}
          sx={{ width: 1 }}
          onChange={(e) => {
            changeSourceSelect(String(e.target.value), i);
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {sourceList}
        </Select>
        {sourceInput}
      </>
    );
  };

  // 列を追加
  const addRow = () => {
    messeageClear();
    setTableRow();
  };

  // テーブルの行を表示(JSXを返す)
  const displayRow = () => {
    return meanRowList.map((meanDto, index) => {
      return (
        <TableRow key={index}>
          <TableCell>
            <InputLabel id="demo-simple-select-label"></InputLabel>
            {displayPosInput(index)}
          </TableCell>
          <TableCell>
            <InputLabel id="demo-simple-select-label"></InputLabel>
            {displaySourceInput(index)}
          </TableCell>
          <TableCell>
            <TextField
              id="input-mean-01"
              label="意味"
              variant="outlined"
              key={index}
              sx={{ width: 1 }}
              onChange={(e) => {
                inputMean(e.target.value, index);
              }}
            />
          </TableCell>
        </TableRow>
      );
    });
  };

  // 品詞プルダウン変更時の入力の更新
  const changePosSelect = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          pos: {
            id: -1
          },
          source: {
            id: -1
          },
          mean: undefined
        });
      }
    }
    copyMeanRowList[i] = {
      pos: {
        id: Number(value),
        name: Number(value) === -2 ? copyMeanRowList[i].pos.name : undefined
      },
      source: copyMeanRowList[i].source,
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList(copyMeanRowList);
  };

  // 品詞入力時の処理
  const inputPos = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList[i] = {
      pos: {
        id: copyMeanRowList[i].pos.id,
        name: value
      },
      source: copyMeanRowList[i].source,
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList(copyMeanRowList);
  };

  // 出典プルダウン変更時の入力の更新
  const changeSourceSelect = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          pos: {
            id: -1
          },
          source: {
            id: -1
          },
          mean: undefined
        });
      }
    }
    copyMeanRowList[i] = {
      pos: copyMeanRowList[i].pos,
      source: {
        id: Number(value),
        name: Number(value) === -2 ? copyMeanRowList[i].source.name : undefined
      },
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList(copyMeanRowList);
  };

  // 出典入力時の処理
  const inputSource = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList[i] = {
      pos: copyMeanRowList[i].pos,
      source: {
        id: copyMeanRowList[i].source.id,
        name: value
      },
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList(copyMeanRowList);
  };

  // 単語の意味入力時の更新
  const inputMean = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          pos: {
            id: -1
          },
          source: {
            id: -1
          },
          mean: undefined
        });
      }
    }
    copyMeanRowList[i] = {
      pos: copyMeanRowList[i].pos,
      source: copyMeanRowList[i].source,
      mean: value
    };
    setMeanRowList(copyMeanRowList);
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

    for (let i = 0; i < meanRowList.length; i++) {
      if (meanRowList[i].pos.id === -1 || (meanRowList[i].pos.id === -2 && !meanRowList[i].pos.name)) {
        setMessage(`エラー:${i + 1}行目の品詞を入力してください`);
        setMessageColor('error');
        return;
      } else if (!meanRowList[i].mean || meanRowList[i].mean === '') {
        setMessage(`エラー:${i + 1}行目の意味を入力してください`);
        setMessageColor('error');
        return;
      }
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    post(
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
      (data: any) => {
        if (data.status === 200 || data.status === 201) {
          setMessage(`単語「${inputWord}」を登録しました`);
          setMessageColor('success.light');
          setInputWord('');
          setMeanRowList([]);
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      }
    );
  };

  // （単語の意味入力）テーブル描画
  const displayTable = () => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 200 }}>{'品詞'}</TableCell>
              <TableCell sx={{ width: 200 }}>{'出典'}</TableCell>
              <TableCell>{'意味'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{displayRow()}</TableBody>
        </Table>
      </TableContainer>
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

          {displayTable()}
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
