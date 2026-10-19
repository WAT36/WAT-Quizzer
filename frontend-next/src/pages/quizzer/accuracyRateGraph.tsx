import React from 'react';
import { Layout } from '@/components/templates/layout/Layout';
import type { GetCategoryRateAPIRequestDto } from 'quizzer-lib';
import { AccuracyGraphFormProvider } from '@/contexts/AccuracyGraphFormContext';
import { AccuracyRateGraphContent } from '@/components/ui-forms/quizzer/accuracyRateGraph/accuracyRateGraphContent/AccuracyRateGraphContent';

export default function AccuracyRateGraphPage() {
  const contents = () => {
    return (
      <AccuracyGraphFormProvider
        defaultValue={{ getCategoryRateData: { file_num: -1 } as GetCategoryRateAPIRequestDto }}
      >
        <AccuracyRateGraphContent />
      </AccuracyGraphFormProvider>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'カテゴリ別正解率表示'} />;
}
