import React, { useState } from 'react';
import { FormControl, FormGroup, FormLabel, IconButton, SelectChangeEvent } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { CategoryQuizCountDto, GetQuizAPIRequestDto, KeywordSearchTarget, PullDownOptionDto } from 'quizzer-lib';
import { getCategoryQuizCountAPI } from '@/utils/api-wrapper';
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

// カテゴリランダム選択の対象とする問題数の上限
const RANDOM_CATEGORY_MAX_QUIZ_COUNT = 200;

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

  const handleRandomCategory = async () => {
    if (categorylistoption.length === 0) return;
    // 問題数が多すぎるカテゴリは除外し、1〜上限問のカテゴリからランダムに選ぶ
    const { result, message } = await getCategoryQuizCountAPI({
      getCategoryQuizCountData: { file_num: getQuizRequestData.file_num }
    });
    if (!result) {
      setMessage(message);
      return;
    }
    const optionValues = new Set(categorylistoption.map((x) => String(x.value)));
    const candidates = (result as CategoryQuizCountDto[]).filter(
      (x) => optionValues.has(x.name) && x.count > 0 && x.count <= RANDOM_CATEGORY_MAX_QUIZ_COUNT
    );
    if (candidates.length === 0) {
      setMessage({
        message: `問題数が${RANDOM_CATEGORY_MAX_QUIZ_COUNT}問以下のカテゴリがありません`,
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }
    const randomCategory = candidates[Math.floor(Math.random() * candidates.length)].name;
    setQuizRequestData((prev) => ({
      ...prev,
      category: randomCategory
    }));
    setCategorySeedValue([randomCategory]);
    setCategoryResetKey((prev) => prev + 1);
  };

  return (
    <FormGroup className="!mt-4">
      <FormControl className="max-w-full">
        <QuizFilePullDown onFileChange={handleFileChange} value={getQuizRequestData.file_num} />
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
