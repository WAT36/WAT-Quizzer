import React, { useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { DisplayWordTestState, PullDownOptionState, QueryOfGetWordState } from '../../../../../../interfaces/state';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './GetWordQueryForm.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { RadioGroup } from '@/components/ui-parts/radioGroup/RadioGroup';
import { Button } from '@/components/ui-elements/button/Button';
import { getTestDataOfFourChoiceAPI } from '@/api/englishbot/getTestDataOfFourChoiceAPI';
import { getLRUTestDataOfFourChoiceAPI } from '@/api/englishbot/getLRUTestDataOfFourChoiceAPI';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';

interface GetWordQueryFormProps {
  sourcelistoption: PullDownOptionState[];
  setTestType?: React.Dispatch<React.SetStateAction<String>>;
  setDisplayWordTest?: React.Dispatch<React.SetStateAction<DisplayWordTestState>>;
}

export const GetWordQueryForm = ({ sourcelistoption, setTestType, setDisplayWordTest }: GetWordQueryFormProps) => {
  const [queryOfGetWord, setQueryOfGetWord] = useState<QueryOfGetWordState>({});
  const setMessage = useSetRecoilState(messageState);
  return (
    <>
      <Card attr={'through-card padding-vertical'}>
        <FormGroup>
          <FormControl>
            <PullDown
              label={'出典'}
              optionList={sourcelistoption}
              onChange={(e) => {
                setQueryOfGetWord({
                  ...queryOfGetWord,
                  source: String(e.target.value)
                });
              }}
            />
          </FormControl>
          <FormControl className={styles.row}>
            サブ出典登録日時指定：
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                className={styles.datePicker}
                onChange={(newValue) => {
                  setQueryOfGetWord({
                    ...queryOfGetWord,
                    subSource: {
                      ...queryOfGetWord.subSource,
                      startDate: newValue as Date
                    }
                  });
                }}
              />
            </LocalizationProvider>
            〜
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                className={styles.datePicker}
                onChange={(newValue) => {
                  setQueryOfGetWord({
                    ...queryOfGetWord,
                    subSource: {
                      ...queryOfGetWord.subSource,
                      endDate: newValue as Date
                    }
                  });
                }}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl>
            テスト形式：
            <RadioGroup
              radioButtonProps={[
                {
                  value: '0',
                  label: '単語名'
                },
                {
                  value: '1',
                  label: '四択'
                },
                {
                  value: '2',
                  label: '意味当て'
                }
              ]}
              defaultValue={'0'}
              setQueryofQuizStater={(value: string) => {
                setTestType && setTestType(value);
              }}
            />
          </FormControl>
        </FormGroup>
      </Card>
      {/* TODO 今思ったが下のAPI2つ共通化すべきでは？LRUには特定のパラメータ入れて分岐処理させる。管理が大変  */}
      <Button
        label={'Random Word'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) =>
          getTestDataOfFourChoiceAPI({
            queryOfGetWordState: queryOfGetWord,
            setMessageStater: setMessage,
            setDisplayWordTest
          })
        }
      />
      <Button
        label={'LRU'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={(e) =>
          getLRUTestDataOfFourChoiceAPI({
            queryOfGetWordState: queryOfGetWord,
            setMessageStater: setMessage,
            setDisplayWordTest
          })
        }
      />
    </>
  );
};
