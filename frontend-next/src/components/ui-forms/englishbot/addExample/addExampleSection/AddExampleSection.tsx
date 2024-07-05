import React from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { CardContent, CardHeader } from '@mui/material';
import styles from '../AddExample.module.css';
import commonStyles from '../../../../common.module.css';
import { InputExampleData } from '@/pages/englishBot/addExample';
import { TextField } from '@/components/ui-elements/textField/TextField';

interface AddExampleSectionProps {
  inputExampleData: InputExampleData;
  setInputExampleData?: React.Dispatch<React.SetStateAction<InputExampleData>>;
}

export const AddExampleSection = ({ inputExampleData, setInputExampleData }: AddExampleSectionProps) => {
  return (
    <>
      <CardContent>
        <Card variant="outlined">
          <CardHeader subheader="英単語名" />
          <CardContent className={commonStyles.cardContent}>
            <TextField
              label="英単語名"
              variant="outlined"
              setStater={(value: string) => {
                if (setInputExampleData) {
                  setInputExampleData({
                    ...inputExampleData,
                    wordName: value
                  });
                }
              }}
              className={['fullWidth']}
              id={'addExampleToWordName'}
            />
          </CardContent>
          <CardHeader subheader="例文(英文)" />
          <CardContent className={commonStyles.cardContent}>
            <TextField
              label="例文(英語)"
              variant="outlined"
              setStater={(value: string) => {
                if (setInputExampleData) {
                  setInputExampleData({
                    ...inputExampleData,
                    exampleEn: value
                  });
                }
              }}
              className={['fullWidth']}
              id={'addExampleEnField'}
            />
          </CardContent>
          <CardHeader subheader="例文(和訳)" />
          <CardContent className={commonStyles.cardContent}>
            <TextField
              label="例文(和訳)"
              variant="outlined"
              setStater={(value: string) => {
                if (setInputExampleData) {
                  setInputExampleData({
                    ...inputExampleData,
                    exampleJa: value
                  });
                }
              }}
              className={['fullWidth']}
              id={'addExampleJaField'}
            />
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
};
