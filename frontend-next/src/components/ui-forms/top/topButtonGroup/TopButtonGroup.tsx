import React from 'react';
import { Button } from '@/components/ui-elements/button/Button';

export const TopButtonGroup = () => {
  return (
    <div>
      <Button
        label={'Quizzer'}
        attr={'top-button'}
        variant="contained"
        size="large"
        color="primary"
        href={'/quizzer/getQuiz' + process.env.NEXT_PUBLIC_URL_END}
      />
      <Button
        label={'English Quiz Bot'}
        attr={'top-button'}
        variant="contained"
        size="large"
        color="secondary"
        href={'/englishBot' + process.env.NEXT_PUBLIC_URL_END}
      />
      <Button
        label={'設定'}
        attr={'top-button'}
        variant="contained"
        size="large"
        color="info"
        href={'/settings' + process.env.NEXT_PUBLIC_URL_END}
      />
    </div>
  );
};
