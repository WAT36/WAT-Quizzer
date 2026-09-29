import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { GetQuizAPIRequestDto } from 'quizzer-lib';
import { InputQueryForm } from '../inputQueryForm/InputQueryForm';
import { QuizSessionMethod, StartQuizSessionParams } from '@/hooks/useQuizSession';

const QUIZ_METHOD_OPTIONS: { value: QuizSessionMethod; label: string }[] = [
  { value: 'random', label: 'ランダム' },
  { value: 'worstRate', label: '最低正解率' },
  { value: 'leastClear', label: '最小回答数' },
  { value: 'LRU', label: 'LRU(最も長期間未回答)' },
  { value: 'review', label: '以前間違えた問題' },
  { value: 'todayNotAnswered', label: '今日まだ解いてない問題' },
  { value: 'recentlyUpdated', label: '直近更新のあった問題' }
];

const DEFAULT_QUIZ_COUNT = 10;

interface QuizSettingsPanelProps {
  open: boolean;
  onClose: () => void;
  getQuizRequestData: GetQuizAPIRequestDto;
  setQuizRequestData: React.Dispatch<React.SetStateAction<GetQuizAPIRequestDto>>;
  onStart: (params: StartQuizSessionParams) => Promise<unknown>;
}

// 出題条件・出題形式・出題数を設定し、出題スタートで出題セッションを開始するための設定パネル
export const QuizSettingsPanel = ({
  open,
  onClose,
  getQuizRequestData,
  setQuizRequestData,
  onStart
}: QuizSettingsPanelProps) => {
  // PullDownは共通コンポーネントの仕様上、常に「選択なし」(-1)を選べてしまうため、未選択を検知できる型にしている
  const [method, setMethod] = useState<QuizSessionMethod | -1>('random');
  const [count, setCount] = useState<number>(DEFAULT_QUIZ_COUNT);
  const [starting, setStarting] = useState(false);

  const isValid = getQuizRequestData.file_num !== -1 && method !== -1 && count > 0;

  const handleStart = async () => {
    if (method === -1 || !isValid || starting) return;
    setStarting(true);
    try {
      await onStart({ getQuizRequestData, getQuizMethod: method, count });
      onClose();
    } finally {
      setStarting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>出題設定</DialogTitle>
      <DialogContent>
        <InputQueryForm getQuizRequestData={getQuizRequestData} setQuizRequestData={setQuizRequestData} />
        <PullDown
          label="出題形式"
          optionList={QUIZ_METHOD_OPTIONS}
          value={method}
          onChange={(e) => setMethod(e.target.value as QuizSessionMethod | -1)}
        />
        <TextField
          label="出題数"
          type="number"
          value={String(count)}
          setStater={(value: string) => {
            const parsed = parseInt(value, 10);
            setCount(isNaN(parsed) ? 0 : parsed);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button label="キャンセル" variant="outlined" onClick={onClose} />
        <Button
          label={starting ? '取得中...' : '出題スタート'}
          variant="contained"
          color="primary"
          disabled={!isValid || starting}
          onClick={handleStart}
        />
      </DialogActions>
    </Dialog>
  );
};
