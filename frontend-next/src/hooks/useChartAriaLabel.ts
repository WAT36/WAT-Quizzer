import { useEffect, useRef } from 'react';
import type { Chart } from 'chart.js';

// react-chartjs-2 は aria-label などの canvas 属性を canvas 要素へ転送しないため、
// Chart.js インスタンスの canvas に直接 aria-label を設定する
export const useChartAriaLabel = (label: string, deps: unknown[] = []) => {
  const chartRef = useRef<Chart<any, any, any> | null>(null);

  useEffect(() => {
    chartRef.current?.canvas.setAttribute('aria-label', label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, ...deps]);

  return chartRef;
};
