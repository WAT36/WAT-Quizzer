import React from 'react';
import { FormControl, FormGroup, SelectChangeEvent, Tab, Tabs } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { BasisTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/basisTabPanel/Basis.tabpanel';
import { AppliedTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/appliedTabPanel/Applied.tabpanel';
import { FourChoiceTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/fourChoiceTabPanel/FourChoice.tabpanel';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { PullDownOptionState, QueryOfAddQuizState } from '../../../../../../interfaces/state';

interface AddQuizFormProps {
  filelistoption: PullDownOptionState[];
  value: number;
  queryOfAddQuizState: QueryOfAddQuizState;
  setValue?: React.Dispatch<React.SetStateAction<number>>;
  setQueryofAddQuizStater?: React.Dispatch<React.SetStateAction<QueryOfAddQuizState>>;
}

// タブ内コンテンツの設定
const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};

export const AddQuizForm = ({
  filelistoption,
  value,
  queryOfAddQuizState,
  setValue,
  setQueryofAddQuizStater
}: AddQuizFormProps) => {
  // ファイル選択の切り替え
  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    if (setQueryofAddQuizStater) {
      setQueryofAddQuizStater((prev) => ({
        ...prev,
        ['fileNum']: e.target.value as number
      }));
    }
  };

  // タブの切り替え
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (setValue && setQueryofAddQuizStater) {
      setValue(newValue);
      setQueryofAddQuizStater((prev) => ({
        fileNum: queryOfAddQuizState.fileNum
      }));
    }
  };

  return (
    <>
      <FormGroup>
        <FormControl>
          <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
        </FormControl>

        <Card variant="outlined">
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="基礎問題" {...a11yProps(0)} />
            <Tab label="応用問題" {...a11yProps(1)} />
            <Tab label="四択問題" {...a11yProps(2)} />
          </Tabs>
          <BasisTabPanel
            value={value}
            index={0}
            queryOfAddQuizState={queryOfAddQuizState}
            setQueryofAddQuizStater={setQueryofAddQuizStater}
          />
          <AppliedTabPanel
            value={value}
            index={1}
            queryOfAddQuizState={queryOfAddQuizState}
            setQueryofAddQuizStater={setQueryofAddQuizStater}
          />
          <FourChoiceTabPanel
            value={value}
            index={2}
            queryOfAddQuizState={queryOfAddQuizState}
            setQueryofAddQuizStater={setQueryofAddQuizStater}
          />
        </Card>
      </FormGroup>
    </>
  );
};
