import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { BasisTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/basisTabPanel/Basis.tabpanel';
import { AppliedTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/appliedTabPanel/Applied.tabpanel';
import { FourChoiceTabPanel } from '@/components/ui-parts/tabpanel-patterns/addQuiz/fourChoiceTabPanel/FourChoice.tabpanel';
import { QueryOfPutQuizState } from '../../../../../../interfaces/state';

interface PutQuizFormProps {
  value: number;
  queryOfPutQuizState: QueryOfPutQuizState;
  setValue?: React.Dispatch<React.SetStateAction<number>>;
  setQueryofPutQuizStater?: React.Dispatch<React.SetStateAction<QueryOfPutQuizState>>;
}

// タブ内コンテンツの設定
const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};

export const PutQuizForm = ({ value, queryOfPutQuizState, setValue, setQueryofPutQuizStater }: PutQuizFormProps) => {
  // タブの切り替え
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (setValue && setQueryofPutQuizStater) {
      setValue(newValue);
      setQueryofPutQuizStater((prev) => ({
        fileNum: queryOfPutQuizState.fileNum,
        quizNum: -1
      }));
    }
  };

  return (
    <>
      <Card variant="outlined">
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="基礎問題" {...a11yProps(0)} />
          <Tab label="応用問題" {...a11yProps(1)} />
          <Tab label="四択問題" {...a11yProps(2)} />
        </Tabs>
        <BasisTabPanel
          value={value}
          index={0}
          queryOfPutQuizState={queryOfPutQuizState}
          setQueryofPutQuizStater={setQueryofPutQuizStater}
        />
        <AppliedTabPanel
          value={value}
          index={1}
          queryOfPutQuizState={queryOfPutQuizState}
          setQueryofPutQuizStater={setQueryofPutQuizStater}
        />
        <FourChoiceTabPanel
          value={value}
          index={2}
          queryOfPutQuizState={queryOfPutQuizState}
          setQueryofPutQuizStater={setQueryofPutQuizStater}
        />
      </Card>
    </>
  );
};
