import React, { useEffect, useState } from 'react';
import { get } from '../../common/API';
import { Checkbox, Container, FormControl, FormControlLabel, FormGroup, SelectChangeEvent } from '@mui/material';
import { ProcessingApiReponse } from '../../../interfaces/api/response';
import { CategoryApiResponse, QuizFileApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { MessageCard } from '@/components/ui-parts/messageCard/MessageCard';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import { Title } from '@/components/ui-elements/title/Title';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../interfaces/state';
import { GetQuizButtonGroup } from '@/components/ui-forms/getQuiz/getQuizButtonGroup/GetQuizButtonGroup';
import { DisplayQuizSection } from '@/components/ui-forms/getQuiz/displayQuizSection/DisplayQuizSection';

export default function SelectQuizPage() {
  const [filelistoption, setFilelistoption] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const [categorylistoption, setCategorylistoption] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ message: '　', messageColor: 'common.black' });
  const [queryOfQuiz, setQueryOfQuiz] = useState<QueryOfQuizState>({
    fileNum: -1,
    quizNum: -1,
    format: 'basic'
  });
  const [displayQuiz, setDisplayQuiz] = useState<DisplayQuizState>({
    fileNum: -1,
    quizNum: -1,
    quizSentense: '',
    quizAnswer: '',
    checked: false,
    expanded: false
  });

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
          filelist.push({
            value: res[i].file_num,
            label: res[i].file_nickname
          });
        }
        setFilelistoption(filelist);
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
            categorylist.push({
              value: res[i].category,
              label: res[i].category
            });
          }
          setQueryOfQuiz({
            ...queryOfQuiz,
            fileNum: e.target.value as number
          });
          setCategorylistoption(categorylist);
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
      },
      {
        file_num: String(e.target.value)
      }
    );
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

          <FormControl>
            <TextField
              label="問題番号"
              setStater={(value: string) => {
                setQueryOfQuiz({
                  ...queryOfQuiz,
                  quizNum: +value
                });
              }}
            />
          </FormControl>

          <FormControl>
            <PullDown
              label={'カテゴリ'}
              optionList={categorylistoption}
              onChange={(e) => {
                setQueryOfQuiz({
                  ...queryOfQuiz,
                  category: String(e.target.value)
                });
              }}
            />
          </FormControl>

          <FormControl>
            <RangeSliderSection
              sectionTitle={'正解率(%)指定'}
              setStater={(value: number[] | number) => {
                setQueryOfQuiz({
                  ...queryOfQuiz,
                  minRate: Array.isArray(value) ? value[0] : value,
                  maxRate: Array.isArray(value) ? value[1] : value
                });
              }}
            />
          </FormControl>

          <FormControl>
            <RadioGroupSection
              sectionTitle={'問題種別'}
              radioGroupProps={{
                radioButtonProps: [
                  {
                    value: 'basic',
                    label: '基礎問題'
                  },
                  {
                    value: 'applied',
                    label: '応用問題'
                  },
                  {
                    value: '4choice',
                    label: '四択問題'
                  }
                ],
                defaultValue: 'basic',
                setQueryofQuizStater: (value: string) => {
                  setQueryOfQuiz({
                    ...queryOfQuiz,
                    format: value
                  });
                }
              }}
            />
          </FormControl>

          <FormControl>
            <FormControlLabel
              value="only-checked"
              control={<Checkbox color="primary" onChange={(e) => setChecked(e.target.checked)} />}
              label="チェック済から出題"
              labelPlacement="start"
            />
          </FormControl>
        </FormGroup>

        <GetQuizButtonGroup
          queryOfQuizState={queryOfQuiz}
          setDisplayQuizStater={setDisplayQuiz}
          setMessageStater={setMessage}
          setQueryofQuizStater={setQueryOfQuiz}
        />

        <DisplayQuizSection
          queryOfQuizState={queryOfQuiz}
          displayQuizState={displayQuiz}
          setMessageStater={setMessage}
          setDisplayQuizStater={setDisplayQuiz}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題出題'} />
    </>
  );
}
