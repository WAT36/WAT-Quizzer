import { useState } from 'react';
import React from 'react';
import { GetExampleQueryForm, ExampleTestData } from '../getExampleForm/GetExampleQueryForm';
import { DisplayTestExampleSection } from '../displayTestExampleSection/DisplayTestExampleSection';

interface ExampleTestSectionProps {}

export const ExampleTestSection = ({}: ExampleTestSectionProps) => {
  const [displayTestData, setDisplayTestData] = useState<ExampleTestData>({});
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  return (
    <>
      <GetExampleQueryForm
        setDisplayTestData={setDisplayTestData}
        setTotalCount={setTotalCount}
      />
      {totalCount !== undefined && (
        <p className="text-sm text-gray-600 mt-1">対象例文数：全{totalCount}件</p>
      )}
      <DisplayTestExampleSection displayTestData={displayTestData} setDisplayTestData={setDisplayTestData} />
    </>
  );
};
