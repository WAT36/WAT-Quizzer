import { TabPanel } from '@/components/ui-elements/tabPanel/TabPanel';
import { CardContent, Input, Typography } from '@mui/material';
import React from 'react';
import styles from '../../TabPanel.module.css';
import { addQuizDto } from '../../../../../../interfaces/api/response';

interface BasisTabPanelProps {
  value: number;
  index: number;
  inputData: addQuizDto;
  setInputData?: React.Dispatch<React.SetStateAction<addQuizDto>>;
}

export const BasisTabPanel = ({ value, index, inputData, setInputData }: BasisTabPanelProps) => (
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
          value={inputData.question || ''}
          onChange={(e) => {
            if (setInputData) {
              setInputData((prev) => ({
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
          value={inputData.answer || ''}
          onChange={(e) => {
            if (setInputData) {
              setInputData((prev) => ({
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
          value={inputData.category || ''}
          onChange={(e) => {
            if (setInputData) {
              setInputData((prev) => ({
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
          value={inputData.img_file || ''}
          onChange={(e) => {
            if (setInputData) {
              setInputData((prev) => ({
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
