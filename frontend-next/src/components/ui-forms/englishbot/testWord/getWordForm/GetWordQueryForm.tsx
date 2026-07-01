import React, { useState } from 'react';
import { FormControl, FormGroup, TextField as MuiTextField } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { Card } from '@/components/ui-elements/card/Card';
import { RadioGroup } from '@/components/ui-parts/radioGroup/RadioGroup';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import {
  getDateForSqlString,
  GetEnglishWordTestDataAPIRequestDto,
  GetEnglishWordTestDataAPIResponseDto,
  PullDownOptionDto
} from 'quizzer-lib';
import { getEnglishWordTestDataAPI } from '@/utils/api-wrapper';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { englishTestTypeRadioButton, englishWordTypeRadioButton } from '@/constants/contents/radioButton';
import { DateRange } from '@/components/ui-parts/dateRange/DateRange';

interface GetWordQueryFormProps {
  sourcelistoption: PullDownOptionDto[];
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetEnglishWordTestDataAPIResponseDto>>;
  setTotalCount?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const GetWordQueryForm = ({ sourcelistoption, setDisplayTestData, setTotalCount }: GetWordQueryFormProps) => {
  const [queryOfTestData, setQueryOfTestData] = useState<GetEnglishWordTestDataAPIRequestDto>({ format: 'random' });
  const setMessage = useSetRecoilState(messageState);
  // TODO テスト形式の値の管理方法　他のファイルでプロパティ形式で管理した方が良い？ constant.tsみたいなの作って　quizzeer側にもこんなのあったよね
  const [testType, setTestType] = useState<string>('0');

  const isRangeInvalid =
    queryOfTestData.result_from !== undefined &&
    queryOfTestData.result_to !== undefined &&
    queryOfTestData.result_from > queryOfTestData.result_to;

  return (
    <>
      <Card attr={['through-card', 'padding-vertical']}>
        <FormGroup>
          <PullDown
            label={'出典'}
            optionList={sourcelistoption}
            onChange={(e) => {
              setQueryOfTestData({
                ...queryOfTestData,
                source: String(e.target.value)
              });
            }}
          />
          <FormControl className="inline-flex !flex-row items-center">
            サブ出典登録日時指定：
            <DateRange
              setStartState={(newValue: Date | null) => {
                setQueryOfTestData({
                  ...queryOfTestData,
                  startDate: getDateForSqlString(newValue as Date)
                });
              }}
              setEndState={(newValue: Date | null) => {
                setQueryOfTestData({
                  ...queryOfTestData,
                  endDate: getDateForSqlString(newValue as Date)
                });
              }}
            />
          </FormControl>
          <FormControl>
            <Checkbox
              value="only-checked"
              label="チェック済から出題"
              onChange={(e) => {
                setQueryOfTestData({
                  ...queryOfTestData,
                  checked: e.target.checked
                });
              }}
            />
          </FormControl>
          <FormControl>
            <RangeSliderSection
              sectionTitle={'正解率(%)指定'}
              setStater={(value: number[] | number) => {
                setQueryOfTestData({
                  ...queryOfTestData,
                  min_rate: Array.isArray(value) ? value[0] : value,
                  max_rate: Array.isArray(value) ? value[1] : value
                });
              }}
            />
          </FormControl>
          <FormControl>
            <div className="flex flex-row items-center gap-2 flex-wrap">
              <span className="text-sm whitespace-nowrap">上位</span>
              <MuiTextField
                className="!my-[8px]"
                variant="outlined"
                label="x件目から"
                type="number"
                inputProps={{ min: 1 }}
                value={queryOfTestData.result_from !== undefined ? String(queryOfTestData.result_from) : ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                  setQueryOfTestData({ ...queryOfTestData, result_from: val });
                }}
                sx={{ width: 120 }}
              />
              <span className="text-sm whitespace-nowrap">〜</span>
              <MuiTextField
                className="!my-[8px]"
                variant="outlined"
                label="y件目まで"
                type="number"
                inputProps={{ min: 1 }}
                value={queryOfTestData.result_to !== undefined ? String(queryOfTestData.result_to) : ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                  setQueryOfTestData({ ...queryOfTestData, result_to: val });
                }}
                sx={{ width: 120 }}
              />
              <span className="text-sm whitespace-nowrap">を対象（空欄で全件）</span>
            </div>
            {isRangeInvalid && (
              <span className="text-red-500 text-xs mt-1">x件目はy件目以下の値を入力してください</span>
            )}
          </FormControl>
          <FormControl>
            単語種別：
            <RadioGroup
              radioButtonProps={englishWordTypeRadioButton}
              defaultValue={'all'}
              setQueryofQuizStater={(value: string) => {
                setQueryOfTestData({
                  ...queryOfTestData,
                  word_type: value as 'all' | 'word' | 'phrase'
                });
              }}
            />
          </FormControl>
          <FormControl>
            テスト形式：
            <RadioGroup
              radioButtonProps={englishTestTypeRadioButton}
              defaultValue={'0'}
              setQueryofQuizStater={(value: string) => {
                setTestType(value);
              }}
            />
          </FormControl>
        </FormGroup>
      </Card>
      {/* TODO API共通化した結果処理同じようなボタン２つ並ぶことになった　これコンポーネントまとめれないか？  */}
      <Button
        label={'Random Word'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        disabled={isRangeInvalid}
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getEnglishWordTestDataAPI({
            getEnglishWordTestData: {
              ...queryOfTestData,
              format: 'random'
            }
          });
          setMessage(result.message);
          setTotalCount && setTotalCount(result.total);
          if (result.message.messageColor === 'common.black') {
            setDisplayTestData &&
              setDisplayTestData({ ...(result.result as GetEnglishWordTestDataAPIResponseDto), testType });
          }
        }}
      />
      <Button
        label={'LRU'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        disabled={isRangeInvalid}
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getEnglishWordTestDataAPI({
            getEnglishWordTestData: {
              ...queryOfTestData,
              format: 'lru'
            }
          });
          setMessage(result.message);
          setTotalCount && setTotalCount(result.total);
          if (result.message.messageColor === 'common.black') {
            setDisplayTestData &&
              setDisplayTestData({ ...(result.result as GetEnglishWordTestDataAPIResponseDto), testType });
          }
        }}
      />
      <Button
        label={'REVIEW'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        disabled={isRangeInvalid}
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getEnglishWordTestDataAPI({
            getEnglishWordTestData: {
              ...queryOfTestData,
              format: 'review'
            }
          });
          setMessage(result.message);
          setTotalCount && setTotalCount(result.total);
          if (result.message.messageColor === 'common.black') {
            setDisplayTestData &&
              setDisplayTestData({ ...(result.result as GetEnglishWordTestDataAPIResponseDto), testType });
          }
        }}
      />
    </>
  );
};
