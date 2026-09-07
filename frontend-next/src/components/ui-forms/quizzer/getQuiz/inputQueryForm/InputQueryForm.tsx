import React, { useState } from 'react';
import { FormControl, FormGroup, FormLabel, IconButton, SelectChangeEvent } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { GetQuizAPIRequestDto, KeywordSearchTarget, PullDownOptionDto } from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { useQuizFormatList } from '@/hooks/useQuizFormatList';
import { useSelectedFileChange } from '@/hooks/useSelectedFileChange';
import { MultiSelectPullDown } from '@/components/ui-elements/multiSelectPullDown/MultiSelectPullDown';
import { ToggleButton } from '@/components/ui-elements/toggleButton/ToggleButton';

interface InputQueryFormProps {
  getQuizRequestData: GetQuizAPIRequestDto;
  setQuizRequestData: React.Dispatch<React.SetStateAction<GetQuizAPIRequestDto>>;
}

// キーワード検索対象のラベル ⇔ 内部値の対応
const KEYWORD_TARGET_LABELS: Record<KeywordSearchTarget, string> = {
  sentence_answer: '問題文または解答',
  explanation: '解説'
};
const KEYWORD_TARGET_BY_LABEL: Record<string, KeywordSearchTarget> = {
  [KEYWORD_TARGET_LABELS.sentence_answer]: 'sentence_answer',
  [KEYWORD_TARGET_LABELS.explanation]: 'explanation'
};

export const InputQueryForm = ({ getQuizRequestData, setQuizRequestData }: InputQueryFormProps) => {
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const [categoryResetKey, setCategoryResetKey] = useState(0);
  const [categorySeedValue, setCategorySeedValue] = useState<string[]>([]);
  const { quizFormatListoption } = useQuizFormatList();
  const setMessage = useSetRecoilState(messageState);

  const selectedFileChangeHandler = useSelectedFileChange({
    setMessage,
    setCategorylistoption,
    setQuizRequestData
  });

  const handleFileChange = (e: SelectChangeEvent<number | string>) => {
    selectedFileChangeHandler(e);
    setQuizRequestData((prev) => ({
      ...prev,
      quiz_num: 0,
      keyword: '',
      category: ''
    }));
    setCategorySeedValue([]);
    setCategoryResetKey((prev) => prev + 1);
  };

  const keywordTargetLabel =
    KEYWORD_TARGET_LABELS[getQuizRequestData.keywordTarget ?? 'sentence_answer'];

  const setKeywordTargetAlignment: React.Dispatch<React.SetStateAction<string>> = (value) => {
    const nextLabel = typeof value === 'function' ? (value as (prev: string) => string)(keywordTargetLabel) : value;
    const nextTarget = KEYWORD_TARGET_BY_LABEL[nextLabel];
    if (!nextTarget) return;
    setQuizRequestData({
      ...getQuizRequestData,
      keywordTarget: nextTarget
    });
  };

  const handleRandomCategory = () => {
    if (categorylistoption.length === 0) return;
    const randomOption = categorylistoption[Math.floor(Math.random() * categorylistoption.length)];
    setQuizRequestData((prev) => ({
      ...prev,
      category: String(randomOption.value)
    }));
    setCategorySeedValue([String(randomOption.value)]);
    setCategoryResetKey((prev) => prev + 1);
  };

  return (
    <FormGroup className="!mt-4">
      <FormControl className="max-w-full">
        <QuizFilePullDown onFileChange={handleFileChange} />
      </FormControl>
      <FormControl className="max-w-full">
        <TextField
          label="問題番号"
          value={(getQuizRequestData.quiz_num ?? 0) > 0 ? String(getQuizRequestData.quiz_num) : ''}
          setStater={(value: string) => {
            setQuizRequestData({
              ...getQuizRequestData,
              quiz_num: +value
            });
          }}
        />
      </FormControl>

      <FormControl className="max-w-full">
        <TextField
          label="キーワード"
          value={getQuizRequestData.keyword || ''}
          setStater={(value: string) => {
            setQuizRequestData({
              ...getQuizRequestData,
              keyword: value
            });
          }}
        />
      </FormControl>

      <div className="!mb-4">
        <FormControl className="max-w-full !block">
          {'検索対象：'}
          <ToggleButton
            alignment={keywordTargetLabel}
            setAlignment={setKeywordTargetAlignment}
            buttonValues={[KEYWORD_TARGET_LABELS.sentence_answer, KEYWORD_TARGET_LABELS.explanation]}
          />
        </FormControl>
      </div>

      <FormControl className="max-w-full !block">
        <div className="flex flex-row items-center gap-2">
          <MultiSelectPullDown
            key={categoryResetKey}
            label={'カテゴリ'}
            className="min-w-0 flex-1"
            optionList={categorylistoption}
            value={categorySeedValue}
            onChange={(e) => {
              setQuizRequestData({
                ...getQuizRequestData,
                category: String(e.target.value)
              });
            }}
          />
          <IconButton
            aria-label="カテゴリをランダム選択"
            title="カテゴリをランダム選択"
            onClick={handleRandomCategory}
            disabled={categorylistoption.length === 0}
            size="small"
          >
            <CasinoIcon />
          </IconButton>
        </div>
      </FormControl>

      <FormControl>
        <RangeSliderSection
          sectionTitle={'正解率(%)指定'}
          setStater={(value: number[] | number) => {
            setQuizRequestData({
              ...getQuizRequestData,
              min_rate: Array.isArray(value) ? value[0] : value,
              max_rate: Array.isArray(value) ? value[1] : value
            });
          }}
        />
      </FormControl>

      <FormControl className="!block">
        <FormGroup row className="flex-wrap gap-x-4 gap-y-2 items-center">
          <FormLabel id="quiz-format-checkbox-group-label">問題種別</FormLabel>
          {quizFormatListoption.map((x) => (
            <Checkbox
              key={x.id}
              value={String(x.id)}
              label={x.name}
              onChange={(e) => {
                setQuizRequestData({
                  ...getQuizRequestData,
                  format_id: {
                    ...getQuizRequestData.format_id,
                    [String(x.id)]: e.target.checked
                  }
                });
              }}
            />
          ))}
          <Checkbox
            value="only-checked"
            label="チェック済から出題"
            onChange={(e) => {
              setQuizRequestData({
                ...getQuizRequestData,
                checked: e.target.checked
              });
            }}
          />
        </FormGroup>
      </FormControl>
    </FormGroup>
  );
};
