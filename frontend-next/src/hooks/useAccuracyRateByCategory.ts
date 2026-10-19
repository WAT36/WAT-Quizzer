import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import type { GetAccuracyRateByCategoryAPIResponseDto, GetCategoryRateAPIRequestDto } from 'quizzer-lib';
import { getAccuracyRateByCategoryAPI } from '@/utils/api-wrapper';

export const useAccuracyRateByCategory = () => {
  const setMessage = useSetRecoilState(messageState);
  const [accuracyData, setAccuracyData] = useState<GetAccuracyRateByCategoryAPIResponseDto>({
    result: [],
    checked_result: [],
    all_result: []
  });

  const fetchAccuracyData = async (getCategoryRateData: GetCategoryRateAPIRequestDto) => {
    if (getCategoryRateData.file_num !== -1) {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getAccuracyRateByCategoryAPI({ getCategoryRateData });
      setMessage(result.message);
      if (result.result) {
        setAccuracyData({ ...(result.result as GetAccuracyRateByCategoryAPIResponseDto) });
      }
    } else {
      setMessage({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error',
        isDisplay: true
      });
    }
  };

  return { accuracyData, fetchAccuracyData };
};
