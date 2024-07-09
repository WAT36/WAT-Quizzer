import React, { memo, useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { DisplayWordTestState, FourChoiceData, MessageState } from '../../../../../../interfaces/state';
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
import { submitEnglishBotTestAPI } from '@/api/englishbot/submitEnglishBotTestAPI';
import { Chip } from '@/components/ui-elements/chip/Chip';

interface DisplayTestWordSectionProps {
  displayWordTest: DisplayWordTestState;
  testType: String;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTestState?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

// TODO これはlibとかに回したい
// 英単語テスト四択APIの返り値から問題文を生成する
interface EnglishWordTestFourChoiceSentenseProps {
  res: FourChoiceData;
  setValue: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}
// eslint-disable-next-line react/display-name
const EnglishWordTestFourChoiceSentense = memo<EnglishWordTestFourChoiceSentenseProps>((props) => {
  const { res, setValue } = props;
  const correctIndex = Math.floor(Math.random() * 4);
  const dummyChoice = res.dummy;
  // ダミー選択肢の配列をランダムに並び替える
  dummyChoice.sort((a, b) => 0.5 - Math.random());

  const choices = dummyChoice.map((x, i) => ({
    isCorrect: `false${i}`,
    sentense: x.mean
  }));
  choices.splice(correctIndex, 0, {
    isCorrect: 'true',
    sentense: res.correct.mean
  });

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setValue((event.target as HTMLInputElement).value === 'true' ? true : false);
        }}
      >
        {choices.map((x, index) => (
          <FormControlLabel key={index} value={x.isCorrect} control={<Radio />} label={x.sentense} />
        ))}
      </RadioGroup>
    </FormControl>
  );
});

export const DisplayTestWordSection = ({
  displayWordTest,
  testType,
  setMessageStater,
  setDisplayWordTestState
}: DisplayTestWordSectionProps) => {
  const [selectedValue, setValue] = useState<boolean>();
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card variant="outlined">
        {testType === '0' ? (
          // TODO ここはコンポーネント化したい。テスト形式ごとに。quizzerの方も同様
          <>
            <CardContent>
              <div>
                <h2>{displayWordTest.wordName || ''}</h2>
                {displayWordTest.wordSource &&
                  displayWordTest.wordSource.map((value) => {
                    return <Chip label={value.source.name} />;
                  })}
              </div>

              <CardActions>
                <MuiButton size="small" onClick={handleExpandClick} aria-expanded={expanded}>
                  答え
                </MuiButton>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="subtitle1" component="h2">
                    {displayWordTest &&
                      displayWordTest.wordMean &&
                      displayWordTest.wordMean.map((mean, index) => {
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
                    onClick={(e) => {
                      submitEnglishBotTestAPI({
                        wordId: displayWordTest.wordId || NaN,
                        selectedValue: true,
                        testType: 0,
                        setMessageStater,
                        setDisplayWordTestState
                      });
                      setExpanded(false);
                    }}
                  />
                  <Button
                    label={'不正解...'}
                    attr={'button-array'}
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      submitEnglishBotTestAPI({
                        wordId: displayWordTest.wordId || NaN,
                        selectedValue: false,
                        testType: 0,
                        setMessageStater,
                        setDisplayWordTestState
                      });
                      setExpanded(false);
                    }}
                  />
                </CardContent>
              </Collapse>
            </CardContent>
          </>
        ) : (
          // TODO ここはコンポーネント化したい。テスト形式ごとに。quizzerの方も同様
          <>
            <CardContent>
              <h2>{displayWordTest.wordName || ''}</h2>
              {displayWordTest.choice && (
                <EnglishWordTestFourChoiceSentense res={displayWordTest.choice} setValue={setValue} />
              )}
            </CardContent>
            <CardContent>
              <Button
                label={'SUBMIT'}
                variant="contained"
                color="primary"
                onClick={(e) =>
                  submitEnglishBotTestAPI({
                    wordId: displayWordTest.wordId || NaN,
                    selectedValue,
                    testType: 1,
                    setMessageStater,
                    setDisplayWordTestState
                  })
                }
                disabled={isNaN(displayWordTest.wordId || NaN)}
              />
            </CardContent>
          </>
        )}
      </Card>
    </>
  );
};
