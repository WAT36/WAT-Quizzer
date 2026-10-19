import React from 'react';
import { AccuracyChart } from '../accuracyChart/AccuracyChart';
import { AccuracyRadarChart } from '../accuracyRadarChart/AccuracyRadarChart';
import type { GetAccuracyRateByCategoryAPIResponseDto } from 'quizzer-lib';
import { useAccuracyGraphForm } from '@/contexts/AccuracyGraphFormContext';

interface DisplayAccuracyChartProps {
  accuracyData: GetAccuracyRateByCategoryAPIResponseDto;
}

export const DisplayAccuracyChart = ({ accuracyData }: DisplayAccuracyChartProps) => {
  const { order, graph } = useAccuracyGraphForm();
  return (
    <>
      {graph === 'Bar' ? (
        <AccuracyChart accuracyData={accuracyData} order={order} />
      ) : graph === 'Radar' ? (
        <AccuracyRadarChart accuracyData={accuracyData} order={order} />
      ) : (
        <></>
      )}
    </>
  );
};
