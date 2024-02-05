import { Layout } from '@/components/templates/layout/Layout';
import React from 'react';

export default function QuizzerTopPage() {
  return (
    <>
      <Layout mode="quizzer" contents={<p>準備中・・・\nここはダッシュボードか何かにする</p>} title={'Top'} />
    </>
  );
}
