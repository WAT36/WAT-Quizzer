import React from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { DisplayWordTestState } from '../../../../../../interfaces/state';
import { EnglishBotTestFourChoiceResponse } from '../../../../../../interfaces/api/response';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

interface DisplayTestWordSectionProps {
  displayWordTest: DisplayWordTestState;
}

// 英単語テスト四択APIの返り値から問題文を生成する
const generateEnglishWordTestFourChoiceSentense = (res: EnglishBotTestFourChoiceResponse) => {
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
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group">
        {choices.map((x, index) => (
          <FormControlLabel key={index} value={x.isCorrect} control={<Radio />} label={x.sentense} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export const DisplayTestWordSection = ({ displayWordTest }: DisplayTestWordSectionProps) => {
  return (
    <>
      <Card variant="outlined">
        <h2>{displayWordTest.wordName}</h2>
        {displayWordTest.choice && generateEnglishWordTestFourChoiceSentense(displayWordTest.choice)}
      </Card>
    </>
  );
};
