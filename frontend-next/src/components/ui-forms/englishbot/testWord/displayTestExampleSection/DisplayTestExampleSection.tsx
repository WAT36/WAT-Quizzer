import React from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { CardActions, CardContent } from '@mui/material';
import { ExampleTestData } from '../getExampleForm/GetExampleQueryForm';

interface DisplayTestExampleSectionProps {
  displayTestData: ExampleTestData;
  setDisplayTestData?: React.Dispatch<React.SetStateAction<ExampleTestData>>;
}

export const DisplayTestExampleSection = ({ displayTestData, setDisplayTestData }: DisplayTestExampleSectionProps) => {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          {/* TODO 問題文（英文）の表示をここに追加する */}
        </CardContent>
        <CardActions>
          {/* TODO 答え表示ボタンをここに追加する */}
        </CardActions>
        <CardContent>
          {/* TODO 正解・不正解ボタンをここに追加する */}
          <Button
            label={'正解!!'}
            attr={'button-array'}
            variant="contained"
            color="primary"
            disabled={!displayTestData.exampleId}
            onClick={async () => {
              // TODO 正解APIを呼び出す
            }}
          />
          <Button
            label={'不正解...'}
            attr={'button-array'}
            variant="contained"
            color="secondary"
            disabled={!displayTestData.exampleId}
            onClick={async () => {
              // TODO 不正解APIを呼び出す
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};
