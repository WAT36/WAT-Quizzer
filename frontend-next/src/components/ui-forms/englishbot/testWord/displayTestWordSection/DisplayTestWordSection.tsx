import React, { memo, useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { DisplayWordTestState, MessageState } from '../../../../../../interfaces/state';
import { EnglishBotTestFourChoiceResponse } from '../../../../../../interfaces/api/response';
import { CardContent, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { submitEnglishBotTestAPI } from '@/common/ButtonAPI';

interface DisplayTestWordSectionProps {
  displayWordTest: DisplayWordTestState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setDisplayWordTestState?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

// 英単語テスト四択APIの返り値から問題文を生成する
interface EnglishWordTestFourChoiceSentenseProps {
  res: EnglishBotTestFourChoiceResponse;
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
  setMessageStater,
  setDisplayWordTestState
}: DisplayTestWordSectionProps) => {
  const [selectedValue, setValue] = useState<boolean>();

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <h2>{displayWordTest.wordName}</h2>
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
                setMessageStater,
                setDisplayWordTestState
              })
            }
            disabled={isNaN(displayWordTest.wordId || NaN)}
          />
        </CardContent>
      </Card>
    </>
  );
};
