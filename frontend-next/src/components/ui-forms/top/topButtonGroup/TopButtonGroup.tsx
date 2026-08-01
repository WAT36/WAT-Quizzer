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
        href={'/quizzer' + process.env.NEXT_PUBLIC_URL_END}
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
        // MUIのデフォルトinfo色は白文字とのコントラスト比がWCAG AA基準(4.5:1)を満たさないため、濃い色に上書きする
        sx={{ backgroundColor: '#01579b', '&:hover': { backgroundColor: '#014477' } }}
        href={'/settings' + process.env.NEXT_PUBLIC_URL_END}
      />
      <Button
        label={'Storybook'}
        attr={'top-button'}
        variant="contained"
        size="large"
        color="warning"
        href={'/storybook' + process.env.NEXT_PUBLIC_URL_END}
      />
    </div>
  );
};
