import React from 'react';
import { CardContent, Typography } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import styles from './AddQuizLogSection.module.css';

interface AddQuizLogSectionProps {
  log: string;
}

export const AddQuizLogSection = ({ log }: AddQuizLogSectionProps) => {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography className={styles.log} color="textSecondary" gutterBottom>
            --実行ログ--
          </Typography>
          <Typography variant="h6" component="h6">
            {log}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
