import { useEffect, useRef } from 'react';
import type { Chart } from 'chart.js';

// react-chartjs-2 は aria-label などの canvas 属性を canvas 要素へ転送しないため、
// Chart.js インスタンスの canvas に直接 aria-label を設定する。
// チャートはデータ取得完了後に初めてマウントされることが多いため、依存配列を付けず
// 毎レンダー後に実行し、canvasがマウントされたタイミングを確実に捕まえる。
export const useChartAriaLabel = (label: string) => {
  const chartRef = useRef<Chart<any, any, any> | null>(null);

  useEffect(() => {
    chartRef.current?.canvas.setAttribute('aria-label', label);
  });

  return chartRef;
};
