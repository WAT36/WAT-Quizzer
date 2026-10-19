import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import type { GetQuizFileApiResponseDto, PullDownOptionDto } from 'quizzer-lib';
import { quizFileListAPIResponseToPullDownAdapter } from 'quizzer-lib';
import { getQuizFileListAPI } from '@/utils/api-wrapper';

export const useQuizFileList = () => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    void (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFileListAPI();
      setMessage(result.message);
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    })();
  }, [setMessage]);

  return { filelistoption };
};
