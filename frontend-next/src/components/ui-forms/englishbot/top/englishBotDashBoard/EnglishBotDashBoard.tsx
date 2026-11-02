import { RandomWordDisplay } from '../randomWordDisplay/RandomWordDisplay';
import { SourceStatisticsCard } from '../sourceStatisticsCard/SourceStatisticsCard';
import { TestLogPastWeekChart } from '../testLogPastWeekCharrt/TestLogPastWeekChart';
import { WordSummaryChart } from '../wordSummaryChart/WordSummaryChart';

interface EnglishBotDashboardProps {}

// 各カードは表示に使うデータをそれぞれ自分で取得する
export const EnglishBotDashboard: React.FC<EnglishBotDashboardProps> = ({}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 overflow-y-auto box-border">
      <WordSummaryChart />
      <RandomWordDisplay />
      <SourceStatisticsCard />
      <TestLogPastWeekChart />
    </div>
  );
};
