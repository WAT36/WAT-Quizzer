import { TabPanel } from '@/components/ui-elements/tabPanel/TabPanel';
import { CardContent, Input, Typography } from '@mui/material';
import React from 'react';
import styles from '../../TabPanel.module.css';
import { AddQuizAPIRequestDto, EditQuizAPIRequestDto } from 'quizzer-lib';

interface BasisTabPanelProps {
  value: number;
  putQuizRequestData: AddQuizAPIRequestDto | EditQuizAPIRequestDto;
  setPutQuizRequestData:
    | React.Dispatch<React.SetStateAction<AddQuizAPIRequestDto>>
    | React.Dispatch<React.SetStateAction<EditQuizAPIRequestDto>>;
}

export const BasisTabPanel = ({ value, putQuizRequestData, setPutQuizRequestData }: BasisTabPanelProps) => (
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
    </CardContent>
  </TabPanel>
);
