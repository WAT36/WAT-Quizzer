import React from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { CardContent, CardHeader, TextField } from '@mui/material';
import styles from '../AddExample.module.css';
import { InputExampleData } from '@/pages/englishBot/addExample';

interface AddExampleSectionProps {
  inputExampleData: InputExampleData;
  setInputExampleData?: React.Dispatch<React.SetStateAction<InputExampleData>>;
}

export const AddExampleSection = ({ inputExampleData, setInputExampleData }: AddExampleSectionProps) => {
  return (
    <>
      <CardContent>
        <Card variant="outlined">
          <CardHeader subheader="例文(英文)" />
          <CardContent className={styles.content}>
            <TextField
              label="例文(英語)"
              variant="outlined"
              onChange={(e) => {
                const copyInputData = Object.assign({}, inputExampleData);
                copyInputData.exampleEn = e.target.value;
                setInputExampleData && setInputExampleData(copyInputData);
              }}
              className={styles.inputText}
            />
          </CardContent>
          <CardHeader subheader="例文(和訳)" />
          <CardContent className={styles.content}>
            <TextField
              label="例文(和訳)"
              variant="outlined"
              onChange={(e) => {
                const copyInputData = Object.assign({}, inputExampleData);
                copyInputData.exampleJa = e.target.value;
                setInputExampleData && setInputExampleData(copyInputData);
              }}
              className={styles.inputText}
            />
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
};
