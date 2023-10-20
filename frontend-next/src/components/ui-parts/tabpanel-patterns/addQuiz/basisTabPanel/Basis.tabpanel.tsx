import { TabPanel } from '@/components/ui-elements/tabPanel/TabPanel';
import { CardContent, Input, Typography } from '@mui/material';
import React from 'react';
import styles from '../../TabPanel.module.css';
import { QueryOfAddQuizState } from '../../../../../../interfaces/state';

interface BasisTabPanelProps {
  value: number;
  index: number;
  queryOfAddQuizState: QueryOfAddQuizState;
  setQueryofAddQuizStater?: React.Dispatch<React.SetStateAction<QueryOfAddQuizState>>;
}

export const BasisTabPanel = ({ value, index, queryOfAddQuizState, setQueryofAddQuizStater }: BasisTabPanelProps) => (
  <TabPanel value={value} index={index}>
    <CardContent>
      <Typography variant="h6" component="h6" className={styles.messageBox}>
        追加する基礎問題（問題文,正解,カテゴリ,画像ファイル名）
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        問題文　：
        <Input
          fullWidth
          maxRows={1}
          value={queryOfAddQuizState.question || ''}
          onChange={(e) => {
            if (setQueryofAddQuizStater) {
              setQueryofAddQuizStater((prev) => ({
                ...prev,
                ['question']: e.target.value
              }));
            }
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        答え　　：
        <Input
          fullWidth
          maxRows={1}
          value={queryOfAddQuizState.answer || ''}
          onChange={(e) => {
            if (setQueryofAddQuizStater) {
              setQueryofAddQuizStater((prev) => ({
                ...prev,
                ['answer']: e.target.value
              }));
            }
          }}
        />
      </Typography>

      <Typography variant="h6" component="h6" className={styles.messageBox}>
        カテゴリ：
        <Input
          fullWidth
          maxRows={1}
          value={queryOfAddQuizState.category || ''}
          onChange={(e) => {
            if (setQueryofAddQuizStater) {
              setQueryofAddQuizStater((prev) => ({
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
          value={queryOfAddQuizState.img_file || ''}
          onChange={(e) => {
            if (setQueryofAddQuizStater) {
              setQueryofAddQuizStater((prev) => ({
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
