import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

import { get, post } from '../../common/API';
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
import { GetAccuracyRateByCategoryServiceDto, ProcessingApiReponse } from '../../../interfaces/api/response';
import { QuizFileApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { getFileList } from '@/common/response';
import { MessageState, PullDownOptionState } from '../../../interfaces/state';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';

export default function AccuracyRateGraphPage() {
  const [file_num, setFileNum] = useState<number>(-1);
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [accuracy_data, setAccuracyData] = useState<GetAccuracyRateByCategoryServiceDto>();
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);

  useEffect(() => {
    getFileList(setMessage, setFilelistoption);
  }, []);

  const getAccuracy = () => {
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
      '/category/rate',
      (data: ProcessingApiReponse) => {
        if (data.status === 200) {
          const res: GetAccuracyRateByCategoryServiceDto[] = data.body as GetAccuracyRateByCategoryServiceDto[];
          setAccuracyData(res[0]);
          setMessage({
            message: '　',
            messageColor: 'commmon.black'
          });
        } else if (data.status === 404) {
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
        file_num: String(file_num)
      }
    );
  };

  const updateCategory = () => {
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
    post(
      '/category',
      {
        file_num: file_num
      },
      (data: ProcessingApiReponse) => {
        if (data.status === 200 || data.status === 201) {
          setMessage({
            message: '指定問題ファイルへのカテゴリ更新に成功しました',
            messageColor: 'success.light'
          });
        } else if (data.status === 404) {
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
      }
    );
  };

  const displayChart = () => {
    const display_data = accuracy_data;

    // データがない場合は何もしない
    if (!display_data) {
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
        // String(Math.round(parseFloat(checked_rate[i].accuracy_rate) * 10) / 10) +
        String(Math.round(checked_rate[i].accuracy_rate * 10) / 10) + '% / ' + String(checked_rate[i].count) + '問';
      // visualized_data.push(['(チェック済問題)', parseFloat(checked_rate[i].accuracy_rate), '#32CD32', annotation_i]);
      visualized_data.push(['(チェック済問題)', checked_rate[i].accuracy_rate, '#32CD32', annotation_i]);
    }

    // カテゴリ毎のデータ追加
    let category_rate = display_data.result;
    for (let i = 0; i < category_rate.length; i++) {
      let annotation_i =
        // String(Math.round(parseFloat(category_rate[i].accuracy_rate) * 10) / 10) +
        String(Math.round(category_rate[i].accuracy_rate * 10) / 10) + '% / ' + String(category_rate[i].count) + '問';
      visualized_data.push([
        category_rate[i].c_category,
        // parseFloat(category_rate[i].accuracy_rate),
        category_rate[i].accuracy_rate,
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
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <FormGroup>
          <FormControl>
            <PullDown
              label={'問題ファイル'}
              optionList={filelistoption}
              onChange={(e) => {
                setFileNum(+e.target.value);
              }}
            />
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
      <Layout mode="quizzer" contents={contents()} title={'カテゴリ別正解率表示'} />
    </>
  );
}
