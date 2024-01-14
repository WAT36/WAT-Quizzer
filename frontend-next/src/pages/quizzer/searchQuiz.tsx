import React, { useEffect, useState } from 'react';

import { DataGrid, GridRowsProp, GridRowSelectionModel } from '@mui/x-data-grid';

import { get, post, put } from '../../common/API';
import { buttonStyle, groupStyle, messageBoxStyle, searchedTableStyle } from '../../styles/Pages';
import { columns } from '../../../utils/quizzer/SearchTable';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
  Typography
} from '@mui/material';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { CategoryApiResponse, QuizFileApiResponse, QuizViewApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState } from '../../../interfaces/state';

export default function SearchQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [value, setValue] = useState<number[] | number>([0, 100]);
  const [checked, setChecked] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [query, setQuery] = useState<string>();
  const [selected_category, setSelectedCategory] = useState<string>();
  const [cond_question, setCondQuestion] = useState<boolean>();
  const [cond_answer, setCondAnswer] = useState<boolean>();
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();
  const [categorylistoption, setCategorylistoption] = useState<JSX.Element[]>();
  const [checkedIdList, setCheckedIdList] = useState<number[]>([] as number[]);
  const [changedCategory, setChangedCategory] = useState<string>('');
  const [format, setFormat] = useState<string>('basic');

  useEffect(() => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
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
        setMessage({
          message: '　',
          messageColor: 'commmon.black'
        });
      } else {
        setMessage({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        });
      }
    });
  }, []);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get(
      '/category',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const res: CategoryApiResponse[] = data.body as CategoryApiResponse[];
          let categorylist = [];
          for (var i = 0; i < res.length; i++) {
            categorylist.push(
              <MenuItem value={res[i].category} key={i}>
                {res[i].category}
              </MenuItem>
            );
          }
          setFileNum(e.target.value as number);
          setCategorylistoption(categorylist);
          setMessage({
            message: '　',
            messageColor: 'commmon.black'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      },
      {
        file_num: String(e.target.value)
      }
    );
  };

  const rangeSlider = () => {
    const handleChange = (event: Event, newValue: number[] | number) => {
      setValue(newValue);
    };

    return (
      <>
        <Typography id="range-slider" gutterBottom>
          正解率(%)指定
        </Typography>
        <Slider value={value} onChange={handleChange} valueLabelDisplay="auto" aria-labelledby="range-slider" />
      </>
    );
  };

  const searchQuiz = () => {
    if (file_num === -1) {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error'
      });
      return;
    }

    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    get(
      '/quiz/search',
      (data: ProcessingApiReponse) => {
        if ((String(data.status)[0] === '2' || String(data.status)[0] === '3') && data.body?.length > 0) {
          const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
          setSearchResult(res);
          setMessage({
            message: 'Success!! ' + res.length + '問の問題を取得しました',
            messageColor: 'success.light'
          });
        } else if (data.status === 404 || data.body?.length === 0) {
          setMessage({
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error'
          });
        } else {
          setMessage({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          });
        }
      },
      {
        file_num: String(file_num),
        query: query || '',
        category: selected_category || '',
        min_rate: String(Array.isArray(value) ? value[0] : value),
        max_rate: String(Array.isArray(value) ? value[1] : value),
        searchInOnlySentense: String(cond_question || ''),
        searchInOnlyAnswer: String(cond_answer || ''),
        checked: String(checked),
        format
      }
    );
  };

  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    setCheckedIdList(selectionModel as number[]);
  };

  // チェックした問題に指定カテゴリを一括登録する
  const registerCategoryToChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:チェックされた問題がありません',
        messageColor: 'error'
      });
      return;
    } else if (changedCategory === '') {
      setMessage({
        message: 'エラー:一括登録するカテゴリ名を入力して下さい',
        messageColor: 'error'
      });
      return;
    }

    // チェックした問題にカテゴリを登録
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const addCategoriesToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = [];
      for (const checkedId of idList) {
        await post(
          '/quiz/category',
          {
            file_num: file_num,
            quiz_num: checkedId,
            category: changedCategory
          },
          (data: ProcessingApiReponse) => {
            if (data.status !== 200 && data.status !== 201) {
              failureIdList.push(checkedId);
            }
          }
        );
      }
      return { failureIdList };
    };
    const { failureIdList } = await addCategoriesToQuiz(checkedIdList);

    let message: string;
    let messageColor: 'error' | 'success.light';
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのカテゴリ登録に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件登録成功）`;
      messageColor = 'error';
    } else {
      message = `チェック問題(${checkedIdList.length}件)へのカテゴリ登録に成功しました`;
      messageColor = 'success.light';
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
    setMessage({
      message,
      messageColor
    });
  };

  // チェックした問題から指定カテゴリを一括削除する
  const removeCategoryFromChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:チェックされた問題がありません',
        messageColor: 'error'
      });
      return;
    } else if (changedCategory === '') {
      setMessage({
        message: 'エラー:一括削除するカテゴリ名を入力して下さい',
        messageColor: 'error'
      });
      return;
    }

    // チェックした問題からカテゴリを削除
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const removeCategories = async (idList: number[]) => {
      const failureIdList: number[] = [];
      for (const checkedId of idList) {
        await put(
          '/quiz/category',
          {
            file_num: file_num,
            quiz_num: checkedId,
            category: changedCategory
          },
          (data: ProcessingApiReponse) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId);
            }
          }
        );
      }
      return { failureIdList };
    };
    const { failureIdList } = await removeCategories(checkedIdList);

    let message: string;
    let messageColor: 'error' | 'success.light';
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]のカテゴリ削除に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件削除成功）`;
      messageColor = 'error';
    } else {
      message = `チェック問題(${checkedIdList.length}件)のカテゴリ削除に成功しました`;
      messageColor = 'success.light';
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
    setMessage({
      message,
      messageColor
    });
  };

  // 選択した問題全てにチェックをつける
  const checkedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:選択された問題がありません',
        messageColor: 'error'
      });
      return;
    }

    // 選択した問題にチェック
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const checkToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = [];
      for (const checkedId of idList) {
        await put(
          '/quiz/check',
          {
            file_num: file_num,
            quiz_num: checkedId
          },
          (data: ProcessingApiReponse) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId);
            }
          }
        );
      }
      return { failureIdList };
    };
    const { failureIdList } = await checkToQuiz(checkedIdList);

    let message: string;
    let messageColor: 'error' | 'success.light';
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのチェック登録に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件登録成功）`;
      messageColor = 'error';
    } else {
      message = `選択した問題(${checkedIdList.length}件)へのチェック登録に成功しました`;
      messageColor = 'success.light';
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
    setMessage({
      message,
      messageColor
    });
  };

  // 選択した問題全てにチェックを外す
  const uncheckedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage({
        message: 'エラー:選択された問題がありません',
        messageColor: 'error'
      });
      return;
    }

    // 選択した問題にチェック
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3'
    });
    const uncheckToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = [];
      for (const checkedId of idList) {
        await put(
          '/quiz/uncheck',
          {
            file_num: file_num,
            quiz_num: checkedId
          },
          (data: ProcessingApiReponse) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId);
            }
          }
        );
      }
      return { failureIdList };
    };
    const { failureIdList } = await uncheckToQuiz(checkedIdList);

    let message: string;
    let messageColor: 'error' | 'success.light';
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのチェック削除に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件削除成功）`;
      messageColor = 'error';
    } else {
      message = `選択した問題(${checkedIdList.length}件)へのチェック削除に成功しました`;
      messageColor = 'success.light';
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([]);
    setChangedCategory('');
    setMessage({
      message,
      messageColor
    });
  };

  // ラジオボタンの選択変更時の処理
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormat((event.target as HTMLInputElement).value);
  };

  const contents = () => {
    return (
      <Container>
        <h1>WAT Quizzer</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
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

          <FormControl>
            <TextField
              label="検索語句"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </FormControl>

          <FormGroup row>
            検索対象：
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    setCondQuestion(e.target.checked);
                  }}
                  name="checkedA"
                />
              }
              label="問題"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    setCondAnswer(e.target.checked);
                  }}
                  name="checkedB"
                />
              }
              label="答え"
            />
          </FormGroup>

          <FormControl>
            <InputLabel id="demo-simple-select-label">カテゴリ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={-1}
              // value={age}
              onChange={(e) => {
                setSelectedCategory(String(e.target.value));
              }}
            >
              <MenuItem value={-1}>選択なし</MenuItem>
              {categorylistoption}
            </Select>
          </FormControl>

          <FormControl>{rangeSlider()}</FormControl>

          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">問題種別</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={format}
              defaultValue="basic"
              onChange={handleRadioChange}
            >
              <FormControlLabel value="basic" control={<Radio />} label="基礎問題" />
              <FormControlLabel value="applied" control={<Radio />} label="応用問題" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormControlLabel
              value="only-checked"
              control={<Checkbox color="primary" onChange={(e) => setChecked(e.target.checked)} />}
              label="チェック済のみ検索"
              labelPlacement="start"
            />
          </FormControl>
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => searchQuiz()}>
          検索
        </Button>

        <div style={searchedTableStyle}>
          <DataGrid
            rows={searchResult}
            columns={columns}
            pageSizeOptions={[15]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
          />
        </div>

        <FormGroup style={groupStyle} row>
          チェックした問題全てにカテゴリ「
          <FormControl>
            <TextField
              id="change-category"
              value={changedCategory}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                setChangedCategory(e.target.value)
              }
            />
          </FormControl>
          」を
          <FormControl>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              disabled={format !== 'basic'}
              onClick={async (e) => await registerCategoryToChecked()}
            >
              一括カテゴリ登録
            </Button>
          </FormControl>
          or
          <FormControl>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              disabled={format !== 'basic'}
              onClick={async (e) => await removeCategoryFromChecked()}
            >
              一括カテゴリ削除
            </Button>
          </FormControl>
        </FormGroup>

        <FormGroup style={groupStyle} row>
          チェックした問題全てに
          <FormControl>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              disabled={format !== 'basic'} // TODO 応用問題検索結果からチェック機能つける
              onClick={async (e) => await checkedToSelectedQuiz()}
            >
              ✅をつける
            </Button>
          </FormControl>
          or
          <FormControl>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              disabled={format !== 'basic'}
              onClick={async (e) => await uncheckedToSelectedQuiz()}
            >
              ✅を外す
            </Button>
          </FormControl>
        </FormGroup>
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題検索'} />
    </>
  );
}
