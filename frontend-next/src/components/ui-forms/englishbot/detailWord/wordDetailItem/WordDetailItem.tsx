import React from 'react';
import { Typography } from '@mui/material';
import { Item } from '@/components/ui-elements/item/Item';
import { Button } from '@/components/ui-elements/button/Button';

interface WordDetailItemProps {
  // メインで表示する文字列(単語名・意味など)
  title: string;
  // titleの上に小さく出す補足(品詞など)
  topCaption?: string;
  // titleの下に小さく出す補足(登録日など)
  bottomCaption?: string;
  // 指定すると右側に「編集」ボタンを出す
  onEdit?: () => void;
}

const Caption = ({ text }: { text: string }) => (
  <Typography align="left" sx={{ fontSize: 14 }} color="text.secondary" component="p">
    {text}
  </Typography>
);

// 単語詳細画面の各項目(意味・出典・類義語など)の1行分
export const WordDetailItem = ({ title, topCaption, bottomCaption, onEdit }: WordDetailItemProps) => {
  return (
    <Item>
      <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography component="div">
          {topCaption && <Caption text={topCaption} />}
          <Typography align="left" variant="h5" component="p">
            {title}
          </Typography>
          {bottomCaption && <Caption text={bottomCaption} />}
        </Typography>
        {onEdit && (
          <Typography component="div" sx={{ marginLeft: 'auto' }}>
            <Button label="編集" variant="outlined" onClick={onEdit} />
          </Typography>
        )}
      </Typography>
    </Item>
  );
};
