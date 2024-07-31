import React, { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { CardContent, CardHeader } from '@mui/material';
import commonStyles from '../../../../common.module.css';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { AddExampleAPIRequestDto, submitExampleSentenseAPI } from 'quizzer-lib';
import { Button } from '@/components/ui-elements/button/Button';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';

interface AddExampleSectionProps {
}

export const AddExampleSection = ({  }: AddExampleSectionProps) => {
  const [addExampleData, setAddExampleData] = useState<AddExampleAPIRequestDto>({
    exampleEn: '',
    exampleJa: '',
    wordName: ''
  });
  const setMessage = useSetRecoilState(messageState);

  return (
    <>
      <Card variant="outlined" attr="margin-vertical" header="例文追加">
        <CardContent>
          <Card variant="outlined">
            <CardHeader subheader="英単語名" />
            <CardContent className={commonStyles.cardContent}>
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
            <CardContent className={commonStyles.cardContent}>
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
            <CardContent className={commonStyles.cardContent}>
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
            } else if (addExampleData.wordName === '') {
              setMessage &&
                setMessage({
                  message: 'エラー:単語または意味へのチェック指定がありません',
                  messageColor: 'error',
                  isDisplay: true
                });
              return;
            }
            setMessage && setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
            const result = await submitExampleSentenseAPI({ addExampleData });
            setMessage && setMessage(result.message);
            // TODO 成功時の条件
            if (result.message.messageColor === 'success.light') {
              setAddExampleData({
                exampleEn: '',
                exampleJa: '',
                wordName: ''
              });
              // 入力データをクリア
              // TODO javascript形式でやるんじゃなくて　コンポーネントの方に削除する関数とか組み入れてやらせたい
              ['addExampleEnField', 'addExampleJaField', 'addExampleToWordName'].forEach((value) => {
                const inputField = document.getElementById(value) as HTMLTextAreaElement;
                if (inputField) {
                  inputField.value = '';
                }
              });
            }
          }}
        />
      </Card>
    </>
  );
};
