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

  return (
    <>
      <GetWordQueryForm sourcelistoption={sourcelistoption} setDisplayTestData={setDisplayTestData} />
      <DisplayTestWordSection displayTestData={displayTestData} setDisplayTestData={setDisplayTestData} />
    </>
  );
};
