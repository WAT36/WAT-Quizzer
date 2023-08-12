import React, { useEffect, useState } from 'react';
import { get, post } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
import { buttonStyle, messageBoxStyle } from '../../styles/Pages';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Collapse,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography
} from '@mui/material';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();
  const [categorylistoption, setCategorylistoption] = useState<JSX.Element[]>();
  const [file_num, setFileNum] = useState<number>(-1);
  const [quiz_num, setQuizNum] = useState<number>();
  const [quiz_sentense, setQuizSentense] = useState<string>();
  const [answer, setAnswer] = useState<string>();
  const [quiz_checked, setQuizChecked] = useState<boolean | null>();
  const [selected_category, setSelectedCategory] = useState<string>();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [value, setValue] = useState<number[] | number>([0, 100]);
  const [checked, setChecked] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');

  useEffect(() => {
    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get('/quiz/file', (data: any) => {
      if (data.status === 200) {
        data = data.body;
        let filelist = [];
        for (var i = 0; i < data.length; i++) {
          filelist.push(
            <MenuItem value={data[i].file_num} key={data[i].file_num}>
              {data[i].file_nickname}
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

  const selectedFileChange = (e: any) => {
    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get(
      '/category',
      (data: any) => {
        if (data.status === 200) {
          data = data.body;
          let categorylist = [];
          for (var i = 0; i < data.length; i++) {
            categorylist.push(
              <MenuItem value={data[i].category} key={i}>
                {data[i].category}
              </MenuItem>
            );
          }
          setFileNum(e.target.value);
          setCategorylistoption(categorylist);
          setMessage('　');
          setMessageColor('common.black');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      },
      {
        file_num: e.target.value
      }
    );
  };

  const getQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    } else if (!quiz_num) {
      setMessage('エラー:問題番号を入力して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get(
      '/quiz',
      (data: any) => {
        if (data.status === 404 || data.body?.length === 0) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else if (data.status === 200) {
          data = data.body;
          setQuizSentense('[' + data[0].file_num + '-' + data[0].quiz_num + ']' + data[0].quiz_sentense);
          setAnswer(data[0].answer);
          setQuizChecked(data[0].checked);
          setExpanded(false);
          setMessage('　');
          setMessageColor('success.light');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      },
      {
        file_num: String(file_num),
        quiz_num: String(quiz_num)
      }
    );
  };

  const answerSection = () => {
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const inputCorrect = () => {
      if (file_num === -1) {
        setMessage('エラー:問題ファイルを選択して下さい');
        setMessageColor('error');
        return;
      } else if (!quiz_num) {
        setMessage('エラー:問題番号を入力して下さい');
        setMessageColor('error');
        return;
      } else if (
        quiz_sentense === undefined ||
        quiz_sentense === null ||
        quiz_sentense === '' ||
        answer === undefined ||
        answer === null ||
        answer === ''
      ) {
        setMessage('エラー:問題を出題してから登録して下さい');
        setMessageColor('error');
        return;
      }

      setMessage('通信中...');
      setMessageColor('#d3d3d3');
      post(
        '/quiz/clear',
        {
          file_num: file_num,
          quiz_num: quiz_num
        },
        (data: any) => {
          if (data.status === 200 || data.status === 201) {
            data = data.body;
            setQuizSentense('');
            setAnswer('');
            setQuizChecked(null);
            setMessage('問題[' + quiz_num + '] 正解+1! 登録しました');
            setMessageColor('success.light');
            setExpanded(false);
          } else {
            setMessage('エラー:外部APIとの連携に失敗しました');
            setMessageColor('error');
          }
        }
      );
    };

    const inputIncorrect = () => {
      if (file_num === -1) {
        setMessage('エラー:問題ファイルを選択して下さい');
        setMessageColor('error');
        return;
      } else if (!quiz_num) {
        setMessage('エラー:問題番号を入力して下さい');
        setMessageColor('error');
        return;
      } else if (
        quiz_sentense === undefined ||
        quiz_sentense === null ||
        quiz_sentense === '' ||
        answer === undefined ||
        answer === null ||
        answer === ''
      ) {
        setMessage('エラー:問題を出題してから登録して下さい');
        setMessageColor('error');
        return;
      }

      setMessage('通信中...');
      setMessageColor('#d3d3d3');
      post(
        '/quiz/fail',
        {
          file_num: file_num,
          quiz_num: quiz_num
        },
        (data: any) => {
          if (data.status === 200 || data.status === 201) {
            data = data.body;
            setQuizSentense('');
            setAnswer('');
            setQuizChecked(null);
            setMessage('問題[' + quiz_num + '] 不正解+1.. 登録しました');
            setMessageColor('success.light');
            setExpanded(false);
          } else {
            setMessage('エラー:外部APIとの連携に失敗しました');
            setMessageColor('error');
          }
        }
      );
    };

    const checkReverseToQuiz = () => {
      if (file_num === -1) {
        setMessage('エラー:問題ファイルを選択して下さい');
        setMessageColor('error');
        return;
      } else if (!quiz_num) {
        setMessage('エラー:問題番号を入力して下さい');
        setMessageColor('error');
        return;
      } else if (
        quiz_sentense === undefined ||
        quiz_sentense === null ||
        quiz_sentense === '' ||
        answer === undefined ||
        answer === null ||
        answer === ''
      ) {
        setMessage('エラー:問題を出題してから登録して下さい');
        setMessageColor('error');
        return;
      }

      setMessage('通信中...');
      setMessageColor('#d3d3d3');
      post(
        '/quiz/check',
        {
          file_num: file_num,
          quiz_num: quiz_num
        },
        (data: any) => {
          if (data.status === 200 || data.status === 201) {
            data = data.body;
            setQuizChecked(Boolean(data));
            setMessage(`問題[${quiz_num}] にチェック${Boolean(data) ? 'をつけ' : 'を外し'}ました`);
            setMessageColor('success.light');
          } else {
            setMessage('エラー:外部APIとの連携に失敗しました');
            setMessageColor('error');
          }
        }
      );
    };

    return (
      <>
        <CardActions>
          <Button size="small" onClick={handleExpandClick} aria-expanded={expanded}>
            答え
          </Button>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1" component="h2">
              {answer}
            </Typography>
            <Button style={buttonStyle} variant="contained" color="primary" onClick={inputCorrect}>
              正解!!
            </Button>
            <Button style={buttonStyle} variant="contained" color="secondary" onClick={inputIncorrect}>
              不正解..
            </Button>
            <Button style={buttonStyle} variant="contained" color="warning" onClick={checkReverseToQuiz}>
              チェックつける/外す
            </Button>
          </CardContent>
        </Collapse>
      </>
    );
  };

  const getRandomQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get(
      '/quiz/random',
      (data: any) => {
        if (data.status === 200 && data.body.length > 0) {
          data = data.body;
          setQuizNum(data[0].quiz_num);
          setQuizSentense(data[0].quiz_sentense);
          setAnswer(data[0].answer);
          setQuizChecked(data[0].checked);
          setMessage('　');
          setMessageColor('success.light');
          setExpanded(false);
        } else if (data.status === 404 || data.body?.length === 0) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      },
      {
        file_num: String(file_num),
        min_rate: String(Array.isArray(value) ? value[0] : value),
        max_rate: String(Array.isArray(value) ? value[1] : value),
        category: selected_category || '',
        checked: String(checked)
      }
    );
  };

  const getWorstRateQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get(
      '/quiz/worst',
      (data: any) => {
        if (data.status === 200 && data.body?.length > 0) {
          data = data.body;
          setQuizNum(data[0].quiz_num);
          setQuizSentense(data[0].quiz_sentense);
          setAnswer(data[0].answer);
          setQuizChecked(data[0].checked);
          setMessage('　');
          setMessageColor('success.light');
          setExpanded(false);
        } else if (data.status === 404 || data.body?.length === 0) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      },
      {
        file_num: String(file_num),
        category: selected_category || '',
        checked: String(checked)
      }
    );
  };

  const getMinimumClearQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get(
      '/quiz/minimum',
      (data: any) => {
        if (data.status === 200 && data.body?.length > 0) {
          data = data.body;
          setQuizNum(data[0].quiz_num);
          setQuizSentense(data[0].quiz_sentense);
          setAnswer(data[0].answer);
          setQuizChecked(data[0].checked);
          setMessage('　');
          setMessageColor('success.light');
          setExpanded(false);
        } else if (data.status === 404 || data.body?.length === 0) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      },
      {
        file_num: String(file_num),
        category: selected_category || '',
        checked: String(checked)
      }
    );
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

          <FormControl>
            <TextField
              label="問題番号"
              onChange={(e) => {
                setQuizNum(Number(e.target.value));
              }}
            />
          </FormControl>

          <FormControl>
            <InputLabel id="demo-simple-select-label">カテゴリ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={''}
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
            <FormControlLabel
              value="only-checked"
              control={<Checkbox color="primary" onChange={(e) => setChecked(e.target.checked)} />}
              label="チェック済から出題"
              labelPlacement="start"
            />
          </FormControl>
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => getQuiz()}>
          出題
        </Button>
        <Button style={buttonStyle} variant="contained" color="secondary" onClick={(e) => getRandomQuiz()}>
          ランダム出題
        </Button>
        <Button style={buttonStyle} variant="contained" color="secondary" onClick={(e) => getWorstRateQuiz()}>
          最低正解率問出題
        </Button>
        <Button style={buttonStyle} variant="contained" color="secondary" onClick={(e) => getMinimumClearQuiz()}>
          最小正解数問出題
        </Button>
        <Button style={buttonStyle} variant="contained" color="info" disabled>
          画像表示
        </Button>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h2">
              問題
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {quiz_checked ? '✅' : ''}
              {quiz_sentense}
            </Typography>
          </CardContent>
          {answerSection()}
        </Card>
      </Container>
    );
  };

  return (
    <>
      <QuizzerLayout contents={contents()} />
    </>
  );
}
