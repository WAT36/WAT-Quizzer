import type { Meta, StoryObj } from '@storybook/nextjs';
import { PullDownWithOther } from './PullDownWithOther';
import { PULLDOWN_NONE_VALUE, PULLDOWN_OTHER_VALUE } from '@/constants/pullDown';

const meta = {
  title: 'Molecules/PullDownWithOther',
  component: PullDownWithOther,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  },
  args: {
    label: '出典',
    optionList: [
      { value: '1', label: 'TOEIC' },
      { value: '2', label: '英検準1級' }
    ],
    onChange: () => {},
    onOtherChange: () => {}
  }
} satisfies Meta<typeof PullDownWithOther>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotSelected: Story = {
  args: {
    value: PULLDOWN_NONE_VALUE
  }
};

export const Selected: Story = {
  args: {
    value: 1
  }
};

// 「その他」を選ぶと、名前の入力欄が出る
export const Other: Story = {
  args: {
    value: PULLDOWN_OTHER_VALUE,
    otherValue: '洋書'
  }
};
