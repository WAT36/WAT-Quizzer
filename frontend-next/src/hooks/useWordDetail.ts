import { useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import type { GetWordDetailAPIResponseDto } from 'quizzer-lib';
import { getWordDetailAPI } from '@/utils/api-wrapper';

// 単語詳細の取得・再取得をまとめたフック
export const useWordDetail = (id: string, initialWordDetail: GetWordDetailAPIResponseDto) => {
  const [wordDetail, setWordDetail] = useState<GetWordDetailAPIResponseDto>(initialWordDetail);
  const setMessage = useSetRecoilState(messageState);

  // 単語詳細を取り直す。失敗した場合は今の表示のままにして、エラーメッセージを出す
  const refetchWordDetail = useCallback(async () => {
    const result = await getWordDetailAPI({ id });
    if (result.isSuccess && result.result) {
      setWordDetail(result.result as GetWordDetailAPIResponseDto);
    } else {
      setMessage(result.message);
    }
  }, [id, setMessage]);

  return { wordDetail, refetchWordDetail };
};
