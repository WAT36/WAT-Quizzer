import { TabPanel } from '@/components/ui-elements/tabPanel/TabPanel';
import { CardContent, Input, Typography } from '@mui/material';
import React from 'react';
import styles from '../../TabPanel.module.css';
import { AddQuizAPIRequestDto, EditQuizAPIRequestDto } from 'quizzer-lib';

interface FourChoiceTabPanelProps {
  value: number;
  putQuizRequestData: AddQuizAPIRequestDto | EditQuizAPIRequestDto;
  setPutQuizRequestData:
    | React.Dispatch<React.SetStateAction<AddQuizAPIRequestDto>>
    | React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

export const FourChoiceTabPanel = ({ value, putQuizRequestData, setPutQuizRequestData }: FourChoiceTabPanelProps) => (
  // TODO ここのindexの値は他の設定ファイルとかに書いてそこから読ませたい
  <TabPanel value={value} index={2}>
    <CardContent>
      <Typography variant="h6" component="h6" className={styles.messageBox}>
        追加する四択問題（問題文,正解,カテゴリ,画像ファイル名）
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        <label htmlFor="question">問題文　：</label>
        <Input
          fullWidth
          maxRows={1}
          id="question"
          value={putQuizRequestData.question || ''}
          onChange={(e) => {
            setPutQuizRequestData((prev: any) => ({
              ...prev,
              question: e.target.value
            }));
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        <label htmlFor="answer">正解　　：</label>
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

      <Typography variant="h6" component="h6" style={{ visibility: 'hidden' }}>
        <label htmlFor="category">カテゴリ：</label>
        <Input
          fullWidth
          maxRows={1}
          id="category"
          value={putQuizRequestData.category}
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
        <label htmlFor="relatedBasisQuiz">関連基礎問題番号(カンマ区切りで問題番号を指定)：</label>
        <Input
          fullWidth
          maxRows={1}
          id="relatedBasisQuiz"
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
        <label htmlFor="dummy1">ダミー選択肢1：</label>
        <Input
          fullWidth
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
    </CardContent>
  </TabPanel>
);
