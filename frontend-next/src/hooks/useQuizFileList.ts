import { useState, useEffect, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import type { GetQuizFileApiResponseDto, PullDownOptionDto } from 'quizzer-lib';
import { quizFileListAPIResponseToPullDownAdapter } from 'quizzer-lib';
import { getQuizFileListAPI } from '@/utils/api-wrapper';

export const useQuizFileList = () => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const setMessage = useSetRecoilState(messageState);

  // 問題ファイル一覧を取得してプルダウンの選択肢にする
  const loadFileList = useCallback(async () => {
    const result = await getQuizFileListAPI();
    const pullDownOption = result.result
      ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
      : [];
    setFilelistoption(pullDownOption);
    return result;
  }, []);

  useEffect(() => {
    void (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await loadFileList();
      setMessage(result.message);
    })();
  }, [setMessage, loadFileList]);

  // ファイルの追加・削除後に一覧を取り直す（追加・削除の結果のメッセージは残すため、メッセージは変えない）
  const reloadFileList = useCallback(async () => {
    await loadFileList();
  }, [loadFileList]);

  return { filelistoption, reloadFileList };
};
