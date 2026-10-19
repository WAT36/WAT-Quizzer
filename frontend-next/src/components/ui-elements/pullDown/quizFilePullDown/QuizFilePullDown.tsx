import React from 'react';

import { useQuizFileList } from '@/hooks/useQuizFileList';
import { PullDown } from '../PullDown';
import type { SelectChangeEvent } from '@mui/material';

type Props = {
  onFileChange: (e: SelectChangeEvent<number | string>) => void;
  value?: number | string;
};

export const QuizFilePullDown: React.FC<Props> = ({ onFileChange, value }) => {
  const { filelistoption } = useQuizFileList();
  return <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={onFileChange} value={value} />;
};
