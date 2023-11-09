import { TabPanel } from '@/components/ui-elements/tabPanel/TabPanel';
import { CardContent, Input, Typography } from '@mui/material';
import React from 'react';
import styles from '../../TabPanel.module.css';
import { QueryOfPutQuizState } from '../../../../../../interfaces/state';

interface FourChoiceTabPanelProps {
  value: number;
  index: number;
  queryOfPutQuizState: QueryOfPutQuizState;
  setQueryofPutQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

export const FourChoiceTabPanel = ({
  value,
  index,
  queryOfPutQuizState,
  setQueryofPutQuizStater
}: FourChoiceTabPanelProps) => (
  <TabPanel value={value} index={index}>
    <CardContent>
      <Typography variant="h6" component="h6" className={styles.messageBox}>
        追加する四択問題（問題文,正解,カテゴリ,画像ファイル名）
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        問題文　：
        <Input
          fullWidth
          maxRows={1}
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
        正解　　：
        <Input
          fullWidth
          maxRows={1}
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
        カテゴリ：
        <Input
          fullWidth
          maxRows={1}
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
        画像ファイル名：
        <Input
          fullWidth
          maxRows={1}
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
        関連基礎問題番号(カンマ区切りで問題番号を指定)：
        <Input
          fullWidth
          maxRows={1}
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
        ダミー選択肢1：
        <Input
          fullWidth
          maxRows={1}
          value={queryOfPutQuizState.dummy1 || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['dummy1']: e.target.value
              }));
            }
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        ダミー選択肢2：
        <Input
          fullWidth
          maxRows={1}
          value={queryOfPutQuizState.dummy2 || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['dummy2']: e.target.value
              }));
            }
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        ダミー選択肢3：
        <Input
          fullWidth
          maxRows={1}
          value={queryOfPutQuizState.dummy3 || ''}
          onChange={(e) => {
            if (setQueryofPutQuizStater) {
              setQueryofPutQuizStater((prev) => ({
                ...prev,
                ['dummy3']: e.target.value
              }));
            }
          }}
        />
      </Typography>
    </CardContent>
  </TabPanel>
);
