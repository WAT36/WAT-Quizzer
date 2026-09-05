import { GetEnglishWordTestDataAPIResponseDto, PullDownOptionDto } from 'quizzer-lib';
import { GetWordQueryForm } from '../getWordForm/GetWordQueryForm';
import { DisplayTestWordSection } from '../displayTestWordSection/DisplayTestWordSection';
import { useState } from 'react';
import React from 'react';

interface WordTestSectionProps {
  sourcelistoption: PullDownOptionDto[];
}

export const WordTestSection = ({ sourcelistoption }: WordTestSectionProps) => {
  const [displayTestData, setDisplayTestData] = useState<GetEnglishWordTestDataAPIResponseDto>({});
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  return (
    <>
      <GetWordQueryForm
        sourcelistoption={sourcelistoption}
        setDisplayTestData={setDisplayTestData}
        setTotalCount={setTotalCount}
      />
      {totalCount !== undefined && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">対象単語数：全{totalCount}件</p>
      )}
      <DisplayTestWordSection displayTestData={displayTestData} setDisplayTestData={setDisplayTestData} />
    </>
  );
};
