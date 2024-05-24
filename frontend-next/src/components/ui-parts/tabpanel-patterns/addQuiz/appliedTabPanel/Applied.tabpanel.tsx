import { TabPanel } from '@/components/ui-elements/tabPanel/TabPanel';
import { CardContent, Input, Typography } from '@mui/material';
import React from 'react';
import styles from '../../TabPanel.module.css';
import { QueryOfPutQuizState } from '../../../../../../interfaces/state';

interface AppliedTabPanelProps {
  value: number;
  index: number;
  queryOfPutQuizState: QueryOfPutQuizState;
  setQueryofPutQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const AppliedTabPanel = ({
  value,
  index,
  queryOfPutQuizState,
  setQueryofPutQuizStater
}: AppliedTabPanelProps) => (
  <TabPanel value={value} index={index}>
    <CardContent>
      <Typography variant="h6" component="h6" className={styles.messageBox}>
        追加する応用問題（問題文,正解,画像ファイル名,関連基礎問題番号）
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        <label htmlFor="question">応用問題文　：</label>
        <Input
          fullWidth
          maxRows={1}
          id="question"
          value={queryOfPutQuizState.question || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['question']: e.target.value
              }));
            }
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        <label htmlFor="answer">応用問題の答え　　：</label>
        <Input
          fullWidth
          maxRows={1}
          id="answer"
          value={queryOfPutQuizState.answer || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['answer']: e.target.value
              }));
            }
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" style={{ visibility: 'hidden' }}>
        <label htmlFor="category">カテゴリ：</label>
        <Input
          fullWidth
          maxRows={1}
          id="category"
          value={queryOfPutQuizState.quiz_category}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['quiz_category']: e.target.value
              }));
            }
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
          value={queryOfPutQuizState.img_file || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['img_data']: e.target.value
              }));
            }
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        <label htmlFor="relatedBasisNum">関連基礎問題番号(カンマ区切りで問題番号を指定)：</label>
        <Input
          fullWidth
          maxRows={1}
          id="relatedBasisNum"
          value={queryOfPutQuizState.matched_basic_quiz_id || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['matched_basic_quiz_id']: e.target.value
              }));
            }
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        <label htmlFor="description">解説：</label>
        <Input
          fullWidth
          maxRows={1}
          id="description"
          value={queryOfPutQuizState.explanation || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['explanation']: e.target.value
              }));
            }
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
