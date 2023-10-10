import React, { useEffect, useState } from 'react';
import { get, post } from '../../common/API';
import { buttonStyle } from '../../styles/Pages';
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
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { CheckQuizApiResponse, ProcessingApiReponse } from '../../../interfaces/api/response';
import { CategoryApiResponse, QuizApiResponse, QuizFileApiResponse, QuizViewApiResponse } from '../../../interfaces/db';
import { Layout } from '@/components/templates/layout/Layout';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { MessageCard } from '@/components/ui-parts/messageCard/MessageCard';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import { Title } from '@/components/ui-elements/title/Title';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { DisplayQuizState, MessageState, QueryOfQuizState } from '../../../interfaces/state';
import { GetQuizButton } from '@/components/ui-parts/button-patterns/getQuiz/GetQuiz.button';
import { GetRandomQuizButton } from '@/components/ui-parts/button-patterns/getRandomQuiz/GetRandomQuiz.button';
import { GetWorstRateQuizButton } from '@/components/ui-parts/button-patterns/getWorstRateQuiz/GetWorstRateQuiz.button';

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

  const answerSection = () => {
    const handleExpandClick = () => {
      setDisplayQuiz({
        ...displayQuiz,
        expanded: !displayQuiz.expanded
      });
    };

    const inputCorrect = () => {
      if (queryOfQuiz.fileNum === -1) {
        setMessage({
          message: 'エラー:問題ファイルを選択して下さい',
          messageColor: 'error'
        });
        return;
      } else if (!queryOfQuiz.quizNum) {
        setMessage({
          message: 'エラー:問題番号を入力して下さい',
          messageColor: 'error'
        });
        return;
      } else if (!displayQuiz.quizSentense || !displayQuiz.quizAnswer) {
        setMessage({
          message: 'エラー:問題を出題してから登録して下さい',
          messageColor: 'error'
        });
        return;
      }

      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3'
      });
      post(
        '/quiz/clear',
        {
          format,
          file_num: queryOfQuiz.fileNum,
          quiz_num: queryOfQuiz.quizNum
        },
        (data: ProcessingApiReponse) => {
          if (data.status === 200 || data.status === 201) {
            setDisplayQuiz({
              ...displayQuiz,
              quizSentense: '',
              quizAnswer: '',
              checked: false,
              expanded: false
            });
            setMessage({
              message: `問題[${queryOfQuiz.quizNum}] 正解+1! 登録しました`,
              messageColor: 'success.light'
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

    const inputIncorrect = () => {
      if (queryOfQuiz.fileNum === -1) {
        setMessage({
          message: 'エラー:問題ファイルを選択して下さい',
          messageColor: 'error'
        });
        return;
      } else if (!queryOfQuiz.quizNum) {
        setMessage({
          message: 'エラー:問題番号を入力して下さい',
          messageColor: 'error'
        });
        return;
      } else if (!displayQuiz.quizSentense || !displayQuiz.quizAnswer) {
        setMessage({
          message: 'エラー:問題を出題してから登録して下さい',
          messageColor: 'error'
        });
        return;
      }

      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3'
      });
      post(
        '/quiz/fail',
        {
          format,
          file_num: queryOfQuiz.fileNum,
          quiz_num: queryOfQuiz.quizNum
        },
        (data: ProcessingApiReponse) => {
          if (data.status === 200 || data.status === 201) {
            setDisplayQuiz({
              ...displayQuiz,
              quizSentense: '',
              quizAnswer: '',
              checked: false,
              expanded: false
            });
            setMessage({
              message: `問題[${queryOfQuiz.quizNum}] 不正解+1.. 登録しました`,
              messageColor: 'success.light'
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

    const checkReverseToQuiz = () => {
      if (queryOfQuiz.fileNum === -1) {
        setMessage({
          message: 'エラー:問題ファイルを選択して下さい',
          messageColor: 'error'
        });
        return;
      } else if (!queryOfQuiz.quizNum) {
        setMessage({
          message: 'エラー:問題番号を入力して下さい',
          messageColor: 'error'
        });
        return;
      } else if (!displayQuiz.quizSentense || !displayQuiz.quizAnswer) {
        setMessage({
          message: 'エラー:問題を出題してから登録して下さい',
          messageColor: 'error'
        });
        return;
      }

      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3'
      });
      post(
        '/quiz/check',
        {
          format,
          file_num: queryOfQuiz.fileNum,
          quiz_num: queryOfQuiz.quizNum
        },
        (data: ProcessingApiReponse) => {
          if (data.status === 200 || data.status === 201) {
            const res: CheckQuizApiResponse[] = data.body as CheckQuizApiResponse[];
            setDisplayQuiz({
              ...displayQuiz,
              checked: res[0].result
            });
            setMessage({
              message: `問題[${queryOfQuiz.quizNum}] にチェック${res[0].result ? 'をつけ' : 'を外し'}ました`,
              messageColor: 'success.light'
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

    return (
      <>
        <CardActions>
          <Button size="small" onClick={handleExpandClick} aria-expanded={displayQuiz.expanded}>
            答え
          </Button>
        </CardActions>
        <Collapse in={displayQuiz.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1" component="h2">
              {displayQuiz.quizAnswer}
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

  const getMinimumClearQuiz = () => {
    if (queryOfQuiz.fileNum === -1) {
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
      '/quiz/minimum',
      (data: ProcessingApiReponse) => {
        if (data.status === 200 && data.body?.length > 0) {
          const res: QuizViewApiResponse[] = data.body as QuizViewApiResponse[];
          setQueryOfQuiz({
            ...queryOfQuiz,
            quizNum: res[0].quiz_num
          });
          setDisplayQuiz({
            ...displayQuiz,
            quizSentense: res[0].quiz_sentense,
            quizAnswer: res[0].answer,
            checked: res[0].checked || false,
            expanded: false
          });
          setMessage({
            message: '　',
            messageColor: 'common.black'
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
        file_num: String(queryOfQuiz.fileNum),
        category: queryOfQuiz.category || '',
        checked: String(checked),
        format
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
                  }
                ],
                defaultValue: 'basic',
                setStater: setFormat
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

        <GetQuizButton
          file_num={queryOfQuiz.fileNum}
          quiz_num={+queryOfQuiz.quizNum}
          format={format}
          setDisplayQuizStater={setDisplayQuiz}
          setMessageStater={setMessage}
        />
        <GetRandomQuizButton
          queryOfQuizState={queryOfQuiz}
          setDisplayQuizStater={setDisplayQuiz}
          setMessageStater={setMessage}
          setQueryofQuizStater={setQueryOfQuiz}
        />
        <GetWorstRateQuizButton
          queryOfQuizState={queryOfQuiz}
          setDisplayQuizStater={setDisplayQuiz}
          setMessageStater={setMessage}
          setQueryofQuizStater={setQueryOfQuiz}
        />
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
              {displayQuiz.checked ? '✅' : ''}
              {displayQuiz.quizSentense}
            </Typography>
          </CardContent>
          {answerSection()}
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Layout mode="quizzer" contents={contents()} title={'問題出題'} />
    </>
  );
}
