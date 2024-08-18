import React, { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import {
  Button as MuiButton,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CardActions,
  Collapse,
  Typography
} from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { Chip } from '@/components/ui-elements/chip/Chip';
import {
  generateFourChoiceSentense,
  GetEnglishWordTestDataAPIResponseDto,
  submitEnglishBotTestAPI,
  toggleWordCheckAPI
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface DisplayTestWordSectionProps {
  displayTestData: GetEnglishWordTestDataAPIResponseDto;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetEnglishWordTestDataAPIResponseDto>>;
}

export const DisplayTestWordSection = ({ displayTestData, setDisplayTestData }: DisplayTestWordSectionProps) => {
  const setMessage = useSetRecoilState(messageState);
  const [expanded, setExpanded] = useState<boolean>(false);
  let isFourchoiceCorrect: boolean | undefined = undefined;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card variant="outlined">
        {displayTestData.testType === '0' ? (
          // TODO ここはコンポーネント化したい。テスト形式ごとに。quizzerの方も同様
          <>
            <CardContent>
              <div>
                <h2>
                  {displayTestData.word?.name || ''}
                  {displayTestData.word?.checked ? '✅' : ''}
                </h2>
                {displayTestData.word?.word_source &&
                  displayTestData.word?.word_source.map((value) => {
                    return <Chip label={value.source.name} />;
                  })}
              </div>

              <CardActions>
                <MuiButton
                  size="small"
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  disabled={!displayTestData.word?.name || displayTestData.word?.name === ''}
                >
                  答え
                </MuiButton>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="subtitle1" component="h2">
                    {displayTestData.word?.mean &&
                      displayTestData.word?.mean.map((mean, index) => {
                        return (
                          <li key={index}>
                            {`[${mean.partsofspeech.name}]`}
                            {mean.meaning}
                          </li>
                        );
                      })}
                  </Typography>
                  <Button
                    label={'正解!!'}
                    attr={'button-array'}
                    variant="contained"
                    color="primary"
                    disabled={!displayTestData.word?.name || displayTestData.word?.name === ''}
                    onClick={async (e) => {
                      setMessage({
                        message: '通信中...',
                        messageColor: '#d3d3d3',
                        isDisplay: true
                      });
                      const result = await submitEnglishBotTestAPI({
                        testResult: {
                          wordId: displayTestData.word?.id || NaN,
                          testType: 0
                        },
                        selectedValue: true
                      });
                      setMessage(result.message);
                      if (result.message.messageColor === 'success.light') {
                        setDisplayTestData && setDisplayTestData({});
                      }
                      setExpanded(false);
                    }}
                  />
                  <Button
                    label={'不正解...'}
                    attr={'button-array'}
                    variant="contained"
                    color="secondary"
                    disabled={!displayTestData.word?.name || displayTestData.word?.name === ''}
                    onClick={async (e) => {
                      setMessage({
                        message: '通信中...',
                        messageColor: '#d3d3d3',
                        isDisplay: true
                      });
                      const result = await submitEnglishBotTestAPI({
                        testResult: {
                          wordId: displayTestData.word?.id || NaN,
                          testType: 0
                        },
                        selectedValue: false
                      });
                      setMessage(result.message);
                      if (result.message.messageColor === 'success.light') {
                        setDisplayTestData && setDisplayTestData({});
                      }
                      setExpanded(false);
                    }}
                  />
                  <Button
                    label={'チェック反転'}
                    attr={'button-array'}
                    variant="contained"
                    color="warning"
                    disabled={!displayTestData.word?.name || displayTestData.word?.name === ''}
                    onClick={async (e) => {
                      setMessage({
                        message: '通信中...',
                        messageColor: '#d3d3d3',
                        isDisplay: true
                      });
                      const result = await toggleWordCheckAPI({
                        toggleCheckData: {
                          wordId: displayTestData.word?.id || NaN
                        }
                      });
                      setMessage(result.message);
                      setDisplayTestData &&
                        setDisplayTestData({
                          ...displayTestData,
                          word: displayTestData.word
                            ? {
                                ...displayTestData.word,
                                checked: !displayTestData.word?.checked
                              }
                            : undefined
                        });
                    }}
                  />
                </CardContent>
              </Collapse>
            </CardContent>
          </>
        ) : displayTestData.testType === '1' ? (
          // TODO ここはコンポーネント化したい。テスト形式ごとに。quizzerの方も同様
          <>
            <CardContent>
              <div>
                <h2>{displayTestData.word?.name || ''}</h2>
                {displayTestData.word?.word_source &&
                  displayTestData.word?.word_source.map((value) => {
                    return <Chip label={value.source.name} />;
                  })}
              </div>
              {displayTestData.correct && displayTestData.dummy && (
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      isFourchoiceCorrect = (event.target as HTMLInputElement).value === 'true' ? true : false;
                    }}
                  >
                    {generateFourChoiceSentense({ correct: displayTestData.correct, dummy: displayTestData.dummy }).map(
                      (x, index) => (
                        <FormControlLabel key={index} value={x.isCorrect} control={<Radio />} label={x.sentense} />
                      )
                    )}
                  </RadioGroup>
                </FormControl>
              )}
            </CardContent>
            <CardContent>
              <Button
                label={'SUBMIT'}
                variant="contained"
                color="primary"
                onClick={async (e) => {
                  setMessage({
                    message: '通信中...',
                    messageColor: '#d3d3d3',
                    isDisplay: true
                  });
                  const result = await submitEnglishBotTestAPI({
                    testResult: {
                      wordId: displayTestData.word?.id || NaN,
                      testType: 1
                    },
                    selectedValue: isFourchoiceCorrect
                  });
                  setMessage(result.message);
                  if (result.message.messageColor === 'success.light') {
                    setDisplayTestData && setDisplayTestData({});
                  }
                  setExpanded(false);
                  isFourchoiceCorrect = undefined;
                }}
                disabled={
                  isNaN(displayTestData.word?.id || NaN) ||
                  !displayTestData.word?.name ||
                  displayTestData.word?.name === ''
                }
              />
            </CardContent>
          </>
        ) : displayTestData.testType === '2' ? (
          // TODO ここはコンポーネント化したい。テスト形式ごとに。quizzerの方も同様
          <>
            <CardContent>
              <Typography variant="subtitle1" component="h2">
                {displayTestData.word?.mean ? (
                  displayTestData.word?.mean.map((mean, index) => {
                    return (
                      <li key={index}>
                        {`[${mean.partsofspeech.name}]`}
                        {mean.meaning}
                      </li>
                    );
                  })
                ) : (
                  <></>
                )}
              </Typography>

              <CardActions>
                <MuiButton
                  size="small"
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  disabled={!displayTestData.word?.name || displayTestData.word?.name === ''}
                >
                  答え
                </MuiButton>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <div>
                    <h2>{displayTestData.word?.name || ''}</h2>
                  </div>
                  <Button
                    label={'正解!!'}
                    attr={'button-array'}
                    variant="contained"
                    color="primary"
                    disabled={!displayTestData.word?.name || displayTestData.word?.name === ''}
                    onClick={async (e) => {
                      setMessage({
                        message: '通信中...',
                        messageColor: '#d3d3d3',
                        isDisplay: true
                      });
                      const result = await submitEnglishBotTestAPI({
                        testResult: {
                          wordId: displayTestData.word?.id || NaN,
                          testType: 2
                        },
                        selectedValue: true
                      });
                      setMessage(result.message);
                      if (result.message.messageColor === 'success.light') {
                        setDisplayTestData && setDisplayTestData({});
                      }
                      setExpanded(false);
                    }}
                  />
                  <Button
                    label={'不正解...'}
                    attr={'button-array'}
                    variant="contained"
                    color="secondary"
                    disabled={!displayTestData.word?.name || displayTestData.word?.name === ''}
                    onClick={async (e) => {
                      setMessage({
                        message: '通信中...',
                        messageColor: '#d3d3d3',
                        isDisplay: true
                      });
                      const result = await submitEnglishBotTestAPI({
                        testResult: {
                          wordId: displayTestData.word?.id || NaN,
                          testType: 2
                        },
                        selectedValue: false
                      });
                      setMessage(result.message);
                      if (result.message.messageColor === 'success.light') {
                        setDisplayTestData && setDisplayTestData({});
                      }
                      setExpanded(false);
                    }}
                  />
                  <Button
                    label={'チェック反転'}
                    attr={'button-array'}
                    variant="contained"
                    color="warning"
                    disabled={!displayTestData.word?.name || displayTestData.word?.name === ''}
                    onClick={async (e) => {
                      setMessage({
                        message: '通信中...',
                        messageColor: '#d3d3d3',
                        isDisplay: true
                      });
                      const result = await toggleWordCheckAPI({
                        toggleCheckData: {
                          wordId: displayTestData.word?.id || NaN
                        }
                      });
                      setMessage(result.message);
                      setDisplayTestData &&
                        setDisplayTestData({
                          ...displayTestData,
                          word: displayTestData.word
                            ? {
                                ...displayTestData.word,
                                checked: !displayTestData.word?.checked
                              }
                            : undefined
                        });
                    }}
                  />
                </CardContent>
              </Collapse>
            </CardContent>
          </>
        ) : (
          <></>
        )}
      </Card>
    </>
  );
};
