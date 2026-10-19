import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import type { GetQuizFormatApiResponseDto } from 'quizzer-lib';
import { getQuizFormatListAPI } from '@/utils/api-wrapper';

export const useQuizFormatList = () => {
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    void (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFormatListAPI();
      setMessage(result.message);
      setQuizFormatListoption(result.result ? (result.result as GetQuizFormatApiResponseDto[]) : []);
    })();
  }, [setMessage]);

  return { quizFormatListoption };
};
