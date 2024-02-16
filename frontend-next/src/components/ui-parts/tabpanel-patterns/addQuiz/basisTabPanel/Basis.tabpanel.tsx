import { TabPanel } from '@/components/ui-elements/tabPanel/TabPanel';
import { CardContent, Input, Typography } from '@mui/material';
import React from 'react';
import styles from '../../TabPanel.module.css';
import { QueryOfPutQuizState } from '../../../../../../interfaces/state';

interface BasisTabPanelProps {
  value: number;
  index: number;
  queryOfPutQuizState: QueryOfPutQuizState;
  setQueryofPutQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const BasisTabPanel = ({ value, index, queryOfPutQuizState, setQueryofPutQuizStater }: BasisTabPanelProps) => (
  <TabPanel value={value} index={index}>
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
        <label htmlFor="answer">答え　　：</label>
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

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        <label htmlFor="category">カテゴリ：</label>
        <Input
          fullWidth
          maxRows={1}
          id="category"
          value={queryOfPutQuizState.category || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['category']: e.target.value
              }));
            }
          }}
        />
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
    </CardContent>
  </TabPanel>
);
