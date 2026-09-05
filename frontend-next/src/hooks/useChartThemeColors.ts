import { useRecoilValue } from 'recoil';
import { themeModeState } from '@/atoms/ThemeMode';

// Chart.js（react-chartjs-2）はダークモードに自動追従しないため、罫線・軸ラベルの色をテーマに応じて切り替える
export const useChartThemeColors = () => {
  const mode = useRecoilValue(themeModeState);
  const isDark = mode === 'dark';

  return {
    gridColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    textColor: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666'
  };
};
