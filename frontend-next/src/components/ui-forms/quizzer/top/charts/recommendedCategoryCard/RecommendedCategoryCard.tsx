import { Card } from '@/components/ui-elements/card/Card';
import { CardContent, Typography, CircularProgress, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { RecommendedCategoryDto } from 'quizzer-lib';
import { getRecommendedCategoriesAPI } from '@/utils/api-wrapper';

interface RecommendedCategoryCardProps {
  file_num: number;
}

const REASON_LABEL: Record<RecommendedCategoryDto['reason'], string> = {
  neverAnswered: '未解答',
  notRecent: '放置気味',
  lowAccuracy: '低正解率'
};

const REASON_COLOR: Record<
  RecommendedCategoryDto['reason'],
  'warning' | 'primary' | 'error'
> = {
  neverAnswered: 'warning',
  notRecent: 'primary',
  lowAccuracy: 'error'
};

const formatSubLabel = (item: RecommendedCategoryDto): string => {
  if (item.reason === 'neverAnswered') return 'まだ一度も解いていません';
  if (item.reason === 'notRecent' && item.days_since_last_answered !== null)
    return `最終解答: ${item.days_since_last_answered}日前`;
  if (item.reason === 'lowAccuracy' && item.recent_accuracy_rate !== null)
    return `直近正解率: ${(item.recent_accuracy_rate * 100).toFixed(0)}%`;
  return '';
};

export const RecommendedCategoryCard = ({ file_num }: RecommendedCategoryCardProps) => {
  const [categories, setCategories] = useState<RecommendedCategoryDto[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file_num === -1) {
      setCategories(null);
      return;
    }
    setLoading(true);
    (async () => {
      const result = await getRecommendedCategoriesAPI({ file_num });
      setCategories(result.result ? (result.result as RecommendedCategoryDto[]) : []);
      setLoading(false);
    })();
  }, [file_num]);

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <div className="h-[350px] flex flex-col">
        <CardContent className="flex-shrink-0">
          <Typography variant="h6" component="h2">
            今日のおすすめカテゴリ
          </Typography>
        </CardContent>

        <div className="flex-1 overflow-y-auto min-h-0">
          <CardContent>
            {file_num === -1 ? (
              <Typography variant="body2" color="text.secondary">
                問題ファイルを何か指定してください
              </Typography>
            ) : loading ? (
              <CircularProgress aria-label="読み込み中" />
            ) : categories && categories.length > 0 ? (
              <ul className="space-y-3">
                {categories.map((item, index) => (
                  <li key={index} className="flex flex-col gap-1 border-b border-gray-100 pb-2 last:border-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip
                        label={REASON_LABEL[item.reason]}
                        color={REASON_COLOR[item.reason]}
                        size="small"
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {item.category_name}
                      </Typography>
                    </div>
                    <Typography variant="caption" color="text.secondary">
                      {formatSubLabel(item)}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2" color="text.secondary">
                おすすめカテゴリはありません
              </Typography>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
