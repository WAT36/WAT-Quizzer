import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import type { Message } from 'quizzer-lib';
import { cleanupEmptyCategoriesAPI } from '@/utils/api-wrapper';

interface CategoryCleanupSectionProps {
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const CategoryCleanupSection = ({ setMessage }: CategoryCleanupSectionProps) => {
  const [deletedCount, setDeletedCount] = useState<number | null>(null);

  const handleCleanup = async () => {
    setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
    const result = await cleanupEmptyCategoriesAPI();
    setMessage(result.message);
    if (result.result) {
      setDeletedCount((result.result as { deleted_count: number }).deleted_count);
    }
  };

  return (
    <Card variant="outlined" className="!my-[10px]">
      <CardHeader title="空カテゴリ整理" />
      <CardContent className="flex items-center gap-4 flex-wrap">
        <Typography variant="body2" color="text.secondary">
          問題が一件も登録されていないカテゴリを削除します。
        </Typography>
        <Button label="空カテゴリ整理" variant="contained" attr="after-inline" onClick={handleCleanup} />
        {deletedCount !== null && (
          <Typography variant="body2">
            {deletedCount === 0 ? '削除対象のカテゴリはありませんでした。' : `${deletedCount} 件のカテゴリを削除しました。`}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
