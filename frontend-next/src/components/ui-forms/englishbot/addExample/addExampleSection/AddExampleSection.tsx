import React, { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { CardContent, CardHeader } from '@mui/material';
import { TextField } from '@/components/ui-elements/textField/TextField';
import type { AddExampleAPIRequestDto, PullDownOptionDto } from 'quizzer-lib';
import { addExampleAPI } from '@/utils/api-wrapper';
import { Button } from '@/components/ui-elements/button/Button';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { clearInputValuesByIds } from '@/utils/dom';
import { PULLDOWN_NONE_VALUE } from '@/constants/pullDown';
import { PullDownWithOther } from '@/components/ui-parts/pullDownWithOther/PullDownWithOther';

interface AddExampleSectionProps {
  sourceList: PullDownOptionDto[];
}

export const AddExampleSection = ({ sourceList }: AddExampleSectionProps) => {
  const [addExampleData, setAddExampleData] = useState<AddExampleAPIRequestDto>({
    exampleEn: '',
    exampleJa: '',
    wordName: '',
    sourceId: PULLDOWN_NONE_VALUE
  });
  const setMessage = useSetRecoilState(messageState);

  return (
    <>
      <Card variant="outlined" attr={['margin-vertical']} header="例文追加">
        <CardContent>
          <Card variant="outlined">
            <CardHeader subheader="英単語名(紐づける場合)" />
            <CardContent className="flex">
              <TextField
                label="英単語名"
                variant="outlined"
                setStater={(value: string) => {
                  setAddExampleData({
                    ...addExampleData,
                    wordName: value
                  });
                }}
                className={['fullWidth']}
                id={'addExampleToWordName'}
              />
            </CardContent>
            <CardHeader subheader="例文(英文)" />
            <CardContent className="flex">
              <TextField
                label="例文(英語)"
                variant="outlined"
                setStater={(value: string) => {
                  setAddExampleData({
                    ...addExampleData,
                    exampleEn: value
                  });
                }}
                className={['fullWidth']}
                id={'addExampleEnField'}
              />
            </CardContent>
            <CardHeader subheader="例文(和訳)" />
            <CardContent className="flex">
              <TextField
                label="例文(和訳)"
                variant="outlined"
                setStater={(value: string) => {
                  setAddExampleData({
                    ...addExampleData,
                    exampleJa: value
                  });
                }}
                className={['fullWidth']}
                id={'addExampleJaField'}
              />
            </CardContent>
            <CardHeader subheader="解説(あれば)" />
            <CardContent className="flex">
              <TextField
                label="解説(英文法など)"
                variant="outlined"
                setStater={(value: string) => {
                  setAddExampleData({
                    ...addExampleData,
                    explanation: value
                  });
                }}
                className={['fullWidth']}
                id={'addExplanationField'}
              />
            </CardContent>
            <CardHeader subheader="出典(あれば)" />
            <CardContent className="flex" style={{ flexDirection: 'column', gap: '8px' }}>
              <PullDownWithOther
                label="出典"
                id="example-source-select"
                optionList={sourceList}
                value={addExampleData.sourceId ?? PULLDOWN_NONE_VALUE}
                otherValue={addExampleData.newSourceName}
                onChange={(value) => {
                  setAddExampleData({
                    ...addExampleData,
                    sourceId: value,
                    newSourceName: undefined
                  });
                }}
                onOtherChange={(value) => {
                  setAddExampleData({
                    ...addExampleData,
                    newSourceName: value
                  });
                }}
              />
            </CardContent>
          </Card>
        </CardContent>
        <Button
          label={'登録'}
          attr={'after-inline'}
          variant="contained"
          color="primary"
          onClick={async (e) => {
            if (addExampleData.exampleEn === '') {
              setMessage &&
                setMessage({
                  message: 'エラー:例文(英文)が入力されていません',
                  messageColor: 'error',
                  isDisplay: true
                });
              return;
            } else if (addExampleData.exampleJa === '') {
              setMessage &&
                setMessage({
                  message: 'エラー:例文(和文)が入力されていません',
                  messageColor: 'error',
                  isDisplay: true
                });
              return;
            }
            setMessage && setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
            const result = await addExampleAPI({ addExampleData });
            setMessage && setMessage(result.message);
            if (result.isSuccess) {
              setAddExampleData({
                exampleEn: '',
                exampleJa: '',
                wordName: '',
                sourceId: addExampleData.sourceId,
                newSourceName: addExampleData.newSourceName
              });
              // 入力データをクリア（出典は保持）
              clearInputValuesByIds([
                'addExampleEnField',
                'addExampleJaField',
                'addExampleToWordName',
                'addExplanationField'
              ]);
            }
          }}
        />
      </Card>
    </>
  );
};
