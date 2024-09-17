import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { getImageOfQuizAPI, getQuizAPI, GetQuizAPIRequestDto, GetQuizApiResponseDto } from 'quizzer-lib';

interface GetQuizButtonGroupProps {
  getQuizRequestData: GetQuizAPIRequestDto;
  setQuizResponseData?: React.Dispatch<React.SetStateAction<GetQuizApiResponseDto>>;
}

export const GetQuizButtonGroup = ({ getQuizRequestData, setQuizResponseData }: GetQuizButtonGroupProps) => {
  const setMessage = useSetRecoilState(messageState);

  return (
    <>
      <Button
        label={'出題'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData });
          setMessage(result.message);
          setQuizResponseData &&
            setQuizResponseData({ ...(result.result as GetQuizApiResponseDto), format: getQuizRequestData.format });
        }}
      />
      <Button
        label={'ランダム出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'random' });
          setMessage(result.message);
          setQuizResponseData &&
            setQuizResponseData({ ...(result.result as GetQuizApiResponseDto), format: getQuizRequestData.format });
        }}
      />
      <Button
        label={'最低正解率問出題'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'worstRate' });
          setMessage(result.message);
          setQuizResponseData &&
            setQuizResponseData({ ...(result.result as GetQuizApiResponseDto), format: getQuizRequestData.format });
        }}
      />
      <Button
        label={'最小回答数問出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'leastClear' });
          setMessage(result.message);
          setQuizResponseData &&
            setQuizResponseData({ ...(result.result as GetQuizApiResponseDto), format: getQuizRequestData.format });
        }}
      />
      <Button
        label={'LRU問出題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'LRU' });
          setMessage(result.message);
          setQuizResponseData &&
            setQuizResponseData({ ...(result.result as GetQuizApiResponseDto), format: getQuizRequestData.format });
        }}
      />
      <Button
        label={'昨日間違えた問題'}
        attr={'button-array'}
        variant="contained"
        color="secondary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getQuizAPI({ getQuizRequestData, getQuizMethod: 'review' });
          setMessage(result.message);
          setQuizResponseData &&
            setQuizResponseData({ ...(result.result as GetQuizApiResponseDto), format: getQuizRequestData.format });
        }}
      />
      <Button
        label={'画像表示'}
        attr={'button-array'}
        variant="contained"
        color="info"
        disabled={true}
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getImageOfQuizAPI({ getQuizRequestData });
          setMessage(result.message);
          // TODO API実装後に　処理を書くこと
        }}
      />
    </>
  );
};
