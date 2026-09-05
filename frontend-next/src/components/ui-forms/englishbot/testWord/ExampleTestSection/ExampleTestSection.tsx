import { useState } from 'react';
import React from 'react';
import { GetExampleTestDataAPIResponseDto, PullDownOptionDto } from 'quizzer-lib';
import { GetExampleQueryForm } from '../getExampleForm/GetExampleQueryForm';
import { DisplayTestExampleSection } from '../displayTestExampleSection/DisplayTestExampleSection';

interface ExampleTestSectionProps {
  sourcelistoption: PullDownOptionDto[];
}

export const ExampleTestSection = ({ sourcelistoption }: ExampleTestSectionProps) => {
  const [displayTestData, setDisplayTestData] = useState<GetExampleTestDataAPIResponseDto>({});
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  return (
    <>
      <GetExampleQueryForm
        sourcelistoption={sourcelistoption}
        setDisplayTestData={setDisplayTestData}
        setTotalCount={setTotalCount}
      />
      {totalCount !== undefined && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">対象例文数：全{totalCount}件</p>
      )}
      <DisplayTestExampleSection displayTestData={displayTestData} setDisplayTestData={setDisplayTestData} />
    </>
  );
};
