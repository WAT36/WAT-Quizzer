import { TabPanel } from '@/components/ui-elements/tabPanel/TabPanel';
import { CardContent, Input, Typography } from '@mui/material';
import React from 'react';
import styles from '../../TabPanel.module.css';
import { AddQuizAPIRequestDto } from 'quizzer-lib';

interface BasisTabPanelProps {
  value: number;
  addQuizRequestData: AddQuizAPIRequestDto;
  setAddQuizRequestData: React.Dispatch<React.SetStateAction<AddQuizAPIRequestDto>>;
}

export const BasisTabPanel = ({ value, addQuizRequestData, setAddQuizRequestData }: BasisTabPanelProps) => (
  // TODO ここのindexの値は他の設定ファイルとかに書いてそこから読ませたい
  <TabPanel value={value} index={0}>
    <CardContent>
      <Typography variant="h6" component="h6" className={styles.messageBox}>
        追加する基礎問題（問題文,正解,カテゴリ,画像ファイル名）
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        <label htmlFor="question">問題文　：</label>
        <Input
          fullWidth
          maxRows={1}
          id="question"
          value={addQuizRequestData.question || ''}
          onChange={(e) => {
            setAddQuizRequestData((prev) => ({
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
          value={addQuizRequestData.answer || ''}
          onChange={(e) => {
            setAddQuizRequestData((prev) => ({
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
          value={addQuizRequestData.quiz_category}
          onChange={(e) => {
            setAddQuizRequestData((prev) => ({
              ...prev,
              quiz_category: e.target.value
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
          value={addQuizRequestData.img_file || ''}
          onChange={(e) => {
            setAddQuizRequestData((prev) => ({
              ...prev,
              img_data: e.target.value
            }));
          }}
        />
      </Typography>
    </CardContent>
  </TabPanel>
);
