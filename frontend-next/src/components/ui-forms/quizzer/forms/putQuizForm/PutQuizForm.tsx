import React, { useEffect, useState } from 'react';
import { CardContent, Input, SelectChangeEvent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import {
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  GetQuizFormatApiResponseDto,
  getQuizFormatListAPI,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter
} from 'quizzer-lib';
import styles from './PutQuizForm.module.css';
import { RadioGroupSection } from '@/components/ui-parts/card-contents/radioGroupSection/RadioGroupSection';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';

interface PutQuizFormProps {
  putQuizRequestData: AddQuizAPIRequestDto | EditQuizAPIRequestDto;
  setPutQuizRequestData:
    | React.Dispatch<React.SetStateAction<AddQuizAPIRequestDto>>
    | React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

export const PutQuizForm = ({ putQuizRequestData, setPutQuizRequestData }: PutQuizFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  // 問題ファイルリスト取得
  useEffect(() => {
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFileListAPI();
      setMessage(result.message);
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    })();
  }, [setMessage]);

  // 問題形式リスト取得
  useEffect(() => {
    // TODO これ　別関数にしたい
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFormatListAPI();
      setMessage(result.message);
      setQuizFormatListoption(result.result ? (result.result as GetQuizFormatApiResponseDto[]) : []);
    })();
  }, [setMessage]);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h6" className={styles.messageBox}>
            追加する問題（問題種別,問題文,正解,カテゴリ,画像ファイル名,関連基礎問題番号,解説,ダミー選択肢）
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="question">問題ファイル：</label>
            <PullDown
              label={'問題ファイル'}
              optionList={filelistoption}
              onChange={(e: SelectChangeEvent<number>) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  file_num: +e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="question">問題種別：</label>
            <RadioGroupSection
              sectionTitle={''}
              radioGroupProps={{
                radioButtonProps: quizFormatListoption.map((x) => {
                  return {
                    value: String(x.id),
                    label: x.name
                  };
                }),
                defaultValue: '1',
                setQueryofQuizStater: (value: string) => {
                  setPutQuizRequestData((prev: any) => ({
                    ...prev,
                    format_id: +value
                  }));
                }
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="question">問題文　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="question"
              value={putQuizRequestData.question || ''}
              onChange={(e) => {
                // TODO ここのany
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  question: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="answer">答え　　：</label>
            <Input
              fullWidth
              maxRows={1}
              id="answer"
              value={putQuizRequestData.answer || ''}
              onChange={(e) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  answer: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="category">カテゴリ：</label>
            <Input
              fullWidth
              maxRows={1}
              id="category"
              value={putQuizRequestData.category || ''}
              onChange={(e) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  category: e.target.value
                }));
              }}
            />
            <p className={styles.notation}>※カテゴリはカンマ(,)区切りで書くこと</p>
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="imgFile">画像ファイル名：</label>
            <Input
              fullWidth
              maxRows={1}
              id="imgFile"
              value={putQuizRequestData.img_file || ''}
              onChange={(e) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  img_file: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="relatedBasisNum">関連基礎問題番号(カンマ区切りで問題番号を指定)：</label>
            <Input
              fullWidth
              disabled={putQuizRequestData.format_id === 1}
              maxRows={1}
              id="relatedBasisNum"
              value={putQuizRequestData.matched_basic_quiz_id || ''}
              onChange={(e) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  matched_basic_quiz_id: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="description">解説：</label>
            <Input
              fullWidth
              maxRows={1}
              id="description"
              value={putQuizRequestData.explanation || ''}
              onChange={(e) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  explanation: e.target.value
                }));
              }}
            />
            <p className={styles.notation}>
              ※選択肢を示したいときは正解文を<b>{'{c}'}</b>、ダミー選択肢１、２、３をそれぞれ<b>{'{d1},{d2},{d3}'}</b>
              で書くこと
            </p>
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="dummy1">ダミー選択肢1：</label>
            <Input
              fullWidth
              disabled={putQuizRequestData.format_id !== 3}
              maxRows={1}
              id="dummy1"
              value={putQuizRequestData.dummy1 || ''}
              onChange={(e) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  dummy1: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="dummy2">ダミー選択肢2：</label>
            <Input
              fullWidth
              disabled={putQuizRequestData.format_id !== 3}
              maxRows={1}
              id="dummy2"
              value={putQuizRequestData.dummy2 || ''}
              onChange={(e) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  dummy2: e.target.value
                }));
              }}
            />
          </Typography>

          <Typography variant="h6" component="h6" className={styles.messageBox}>
            <label htmlFor="dummy3">ダミー選択肢3：</label>
            <Input
              fullWidth
              disabled={putQuizRequestData.format_id !== 3}
              maxRows={1}
              id="dummy3"
              value={putQuizRequestData.dummy3 || ''}
              onChange={(e) => {
                setPutQuizRequestData((prev: any) => ({
                  ...prev,
                  dummy3: e.target.value
                }));
              }}
            />
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
