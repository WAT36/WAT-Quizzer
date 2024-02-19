import React, { useEffect, useState } from 'react';

import { get, post } from '../../common/API';
import { buttonStyle } from '../../styles/Pages';
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { SendToAddWordApiData, meanOfAddWordDto } from '../../../interfaces/api/response';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { SourceApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { getPartOfSpeechList } from '@/common/response';

export default function EnglishBotAddWordPage() {
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });
  const [posList, setPosList] = useState<PullDownOptionState[]>([]);
  const [sourceList, setSourceList] = useState<JSX.Element[]>([]);
  const [meanRowList, setMeanRowList] = useState<meanOfAddWordDto[]>([]);
  const [inputWord, setInputWord] = useState<string>('');

  useEffect(() => {
    Promise.all([getPartOfSpeechList(setMessage, setPosList), , getSourceList()]);
  }, []);

  const messeageClear = () => {
    setMessage({
      message: '　',
      messageColor: 'common.black'
    });
  };

  // 出典リスト取得
  const getSourceList = async () => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get('/english/source', (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: SourceApiResponse[] = data.body as SourceApiResponse[];
        let gotSourceList = [];
        for (var i = 0; i < result.length; i++) {
          gotSourceList.push(
            <MenuItem value={result[i].id} key={result[i].id}>
              {result[i].name}
            </MenuItem>
          );
        }
        gotSourceList.push(
          <MenuItem value={-2} key={-2}>
            {'その他'}
          </MenuItem>
        );
        setSourceList(gotSourceList);
        setMessage({
          message: '　',
          messageColor: 'common.black'
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
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

  // 最終列を削除
  const decrementTableRow = () => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList.pop();
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
          {posList.map((x) => (
            <MenuItem value={x.value} key={x.value}>
              {x.label}
            </MenuItem>
          ))}
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

  // 列を削除
  const decrementRow = () => {
    messeageClear();
    decrementTableRow();
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

          {displayTable()}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <IconButton onClick={addRow}>
              <AddCircleOutlineIcon />
            </IconButton>
            <IconButton onClick={decrementRow}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Stack>
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
