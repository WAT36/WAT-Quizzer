import { GetAccuracyRateByCategoryServiceDto } from '../../../../../../interfaces/api/response';
import { Chart } from 'react-google-charts';

interface AccuracyChartProps {
  accuracyData: GetAccuracyRateByCategoryServiceDto;
}

export const AccuracyChart = ({ accuracyData }: AccuracyChartProps) => {
  // データがない場合は何もしない
  if (accuracyData.result.length === 0) {
    return <></>;
  }

  let visualized_data = [];
  visualized_data.push(
    ['Name', 'Accuracy_Rate', { role: 'style' }, { role: 'annotation' }]
    // ["Copper", 8.94, "#b87333", null],
    // ["Silver", 10.49, "silver", null],
    // ["Gold", 19.3, "gold", null],
    // ["Platinum", 21.45, "color: #e5e4e2", null],
  );

  // チェック済データ追加
  let checked_rate = accuracyData.checked_result;
  for (let i = 0; i < checked_rate.length; i++) {
    let annotation_i =
      // String(Math.round(parseFloat(checked_rate[i].accuracy_rate) * 10) / 10) +
      String(Math.round(+checked_rate[i].accuracy_rate * 10) / 10) + '% / ' + String(checked_rate[i].count) + '問';
    // visualized_data.push(['(チェック済問題)', parseFloat(checked_rate[i].accuracy_rate), '#32CD32', annotation_i]);
    visualized_data.push(['(チェック済問題)', +checked_rate[i].accuracy_rate, '#32CD32', annotation_i]);
  }

  // カテゴリ毎のデータ追加
  let category_rate = accuracyData.result;
  for (let i = 0; i < category_rate.length; i++) {
    let annotation_i =
      // String(Math.round(parseFloat(category_rate[i].accuracy_rate) * 10) / 10) +
      String(Math.round(+category_rate[i].accuracy_rate * 10) / 10) + '% / ' + String(category_rate[i].count) + '問';
    visualized_data.push([
      category_rate[i].c_category,
      // parseFloat(category_rate[i].accuracy_rate),
      +category_rate[i].accuracy_rate,
      '#76A7FA',
      annotation_i
    ]);
  }

  // グラフ領域の縦の長さ（＝40 * データの個数）
  let graph_height = 40 * visualized_data.length;

  const options = {
    height: graph_height,
    legend: { position: 'none' },
    chartArea: {
      left: '15%',
      top: 10,
      width: '75%',
      height: graph_height - 50
    },
    hAxis: {
      minValue: 0,
      maxValue: 1
    }
  };
  return <Chart chartType="BarChart" width="100%" data={visualized_data} options={options} />;
};
