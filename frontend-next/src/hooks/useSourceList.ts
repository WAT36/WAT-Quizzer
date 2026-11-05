import { useEffect, useState } from 'react';
import type { PullDownOptionDto, SourceApiResponse } from 'quizzer-lib';
import { apiResponsePullDownAdapter } from 'quizzer-lib';
import { getSourceListAPI } from '@/utils/api-wrapper';

export const useSourceList = (isMock?: boolean, initialList: PullDownOptionDto[] = []) => {
  const [sourceList, setSourceList] = useState<PullDownOptionDto[]>(initialList);

  useEffect(() => {
    if (isMock) return;
    void (async () => {
      const result = await getSourceListAPI();
      result.result && setSourceList(apiResponsePullDownAdapter(result.result as SourceApiResponse[]));
    })();
  }, [isMock]);

  return { sourceList };
};
