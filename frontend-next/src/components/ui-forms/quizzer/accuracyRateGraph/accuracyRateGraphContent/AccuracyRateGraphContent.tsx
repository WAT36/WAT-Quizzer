import React from 'react';
import { Container } from '@mui/material';
import { GetAccuracyGraphForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getAccuracyGraphForm/GetAccuracyGraphForm';
import { DisplayAccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/displayAccuracyChart/DisplayAccuracyChart';
import { CategoryTreemapChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/categoryTreemapChart/CategoryTreemapChart';
import { useAccuracyRateByCategory } from '@/hooks/useAccuracyRateByCategory';
import { useCategoryTreemapData } from '@/hooks/useCategoryTreemapData';
import { useAccuracyGraphForm } from '@/contexts/AccuracyGraphFormContext';

export const AccuracyRateGraphContent = () => {
  const { getCategoryRateData } = useAccuracyGraphForm();
  const { accuracyData, fetchAccuracyData } = useAccuracyRateByCategory();
  const { treemapData, fetchTreemapData } = useCategoryTreemapData();

  const handleDisplayClick = () => {
    void fetchAccuracyData(getCategoryRateData);
    void fetchTreemapData(getCategoryRateData.file_num);
  };

  return (
    <Container>
      <GetAccuracyGraphForm onDisplayClick={handleDisplayClick} />
      <DisplayAccuracyChart accuracyData={accuracyData} />
      <CategoryTreemapChart data={treemapData} />
    </Container>
  );
};
