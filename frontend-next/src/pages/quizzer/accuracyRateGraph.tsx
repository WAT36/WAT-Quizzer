import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

import { get, post } from '../../common/API';
import QuizzerLayout from './components/QuizzerLayout';
import { buttonStyle, messageBoxStyle } from '../../styles/Pages';
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';

export default function AccuracyRateGraphPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');
  const [accuracy_data, setAccuracyData] = useState<any>();
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>();

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

  const getAccuracy = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    get(
      '/category/rate',
      (data: any) => {
        if (data.status === 200) {
          data = data.body;
          setAccuracyData(data);
          setMessage('　');
          setMessageColor('success.light');
        } else if (data.status === 404) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      },
      {
        file_num: String(file_num)
      }
    );
  };

  const updateCategory = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい');
      setMessageColor('error');
      return;
    }

    setMessage('通信中...');
    setMessageColor('#d3d3d3');
    post(
      '/category',
      {
        file_num: file_num
      },
      (data: any) => {
        if (data.status === 200 || data.status === 201) {
          data = data.body;
          setMessage('指定問題ファイルへのカテゴリ更新に成功しました');
          setMessageColor('success.light');
        } else if (data.status === 404) {
          setMessage('エラー:条件に合致するデータはありません');
          setMessageColor('error');
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました');
          setMessageColor('error');
        }
      }
    );
  };

  const displayChart = () => {
    const display_data = accuracy_data;

    // データがない場合は何もしない
    if (
      display_data === undefined ||
      display_data === null ||
      display_data.result === undefined ||
      display_data.checked_result === undefined
    ) {
      return;
    }

    let visualized_data = [];
    visualized_data.push(
      ['Name', 'Accuracy_Rate', { role: 'style' }, { role: 'annotation' }]
      // ["Copper", 8.94, "#b87333", null],
      // ["Silver", 10.49, "silver", null],
      // ["Gold", 19.3, "gold", null],
      // ["Platinum", 21.45, "color: #e5e4e2", null],
    );

    // チェック済データ追加
    let checked_rate = display_data.checked_result;
    for (let i = 0; i < checked_rate.length; i++) {
      let annotation_i =
        String(Math.round(parseFloat(checked_rate[i].accuracy_rate) * 10) / 10) +
        '% / ' +
        String(checked_rate[i].count) +
        '問';
      visualized_data.push(['(チェック済問題)', parseFloat(checked_rate[i].accuracy_rate), '#32CD32', annotation_i]);
    }

    // カテゴリ毎のデータ追加
    let category_rate = display_data.result;
    for (let i = 0; i < category_rate.length; i++) {
      let annotation_i =
        String(Math.round(parseFloat(category_rate[i].accuracy_rate) * 10) / 10) +
        '% / ' +
        String(category_rate[i].count) +
        '問';
      visualized_data.push([
        category_rate[i].c_category,
        parseFloat(category_rate[i].accuracy_rate),
        '#76A7FA',
        annotation_i
      ]);
    }

    // グラフ領域の縦の長さ（＝40 * データの個数）
    let graph_height = 40 * visualized_data.length;

    const options = {
      height: graph_height,
      legend: { position: 'none' },
      chartArea: {
        left: '15%',
        top: 10,
        width: '75%',
        height: graph_height - 50
      },
      hAxis: {
        minValue: 0,
        maxValue: 1
      }
    };

    return (
      <>
        <Chart chartType="BarChart" width="100%" height="400px" data={visualized_data} options={options} />
      </>
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
              onChange={(e) => {
                setFileNum(Number(e.target.value));
              }}
            >
              <MenuItem value={-1} key={-1}>
                選択なし
              </MenuItem>
              {filelistoption}
            </Select>
          </FormControl>
        </FormGroup>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => getAccuracy()}>
          正解率表示
        </Button>

        <Button style={buttonStyle} variant="contained" color="primary" onClick={(e) => updateCategory()}>
          カテゴリ更新
        </Button>

        {displayChart()}
      </Container>
    );
  };

  return (
    <>
      <QuizzerLayout contents={contents()} title={'カテゴリ別正解率表示'} />
    </>
  );
}
