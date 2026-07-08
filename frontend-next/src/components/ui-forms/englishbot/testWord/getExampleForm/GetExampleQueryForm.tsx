import React from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { FormGroup } from '@mui/material';

// TODO 例文テストデータ取得APIのリクエスト/レスポンスDTOができたら差し替える
export interface ExampleTestData {
  exampleId?: number;
  enSentense?: string;
  jaSentense?: string;
}

interface GetExampleQueryFormProps {
  setDisplayTestData?: React.Dispatch<React.SetStateAction<ExampleTestData>>;
  setTotalCount?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const GetExampleQueryForm = ({ setDisplayTestData, setTotalCount }: GetExampleQueryFormProps) => {
  return (
    <>
      <Card attr={['through-card', 'padding-vertical']}>
        <FormGroup>
          {/* TODO 出題条件フォームをここに追加する */}
        </FormGroup>
      </Card>
      {/* TODO 出題ボタンをここに追加する */}
      <Button
        label={'Random Example'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async () => {
          // TODO APIを呼び出して例文テストデータを取得する
        }}
      />
    </>
  );
};
