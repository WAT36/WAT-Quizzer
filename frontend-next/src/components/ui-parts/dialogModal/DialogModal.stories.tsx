import type { Meta, StoryObj } from '@storybook/nextjs';
import { Typography } from '@mui/material';
import { DialogModal } from './DialogModal';
import { Button } from '@/components/ui-elements/button/Button';

const meta = {
  title: 'Molecules/DialogModal',
  component: DialogModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof DialogModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithActions: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    title: 'タイトル',
    children: <Typography variant="body2">本文が入ります。</Typography>,
    actions: (
      <>
        <Button label="キャンセル" attr={'button-array'} variant="outlined" color="inherit" />
        <Button label="OK" attr={'button-array'} variant="contained" />
      </>
    )
  }
};

export const TitleOnly: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    title: 'タイトルのみ'
  }
};
