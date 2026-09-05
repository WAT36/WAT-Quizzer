import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tooltip, TooltipProps } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'ui-elements/Tooltip',
  component: Tooltip,
  tags: ['autodocs']
};

export default meta;

export const Default: StoryObj<TooltipProps> = {
  args: {
    text: 'マウスホバー、またはタップすると全文が表示されます'
  }
};

// 幅を狭めることで、はみ出した長文が省略表示され、ホバー/タップで全文表示されることを確認できる
export const Truncated: StoryObj<TooltipProps> = {
  args: {
    text: 'これは非常に長いテキストのサンプルです。省略された部分は、ホバー（PC）またはタップ（iPadなどのタッチ端末）で全文を確認できます。',
    className: 'block w-40 truncate'
  }
};

export const Empty: StoryObj<TooltipProps> = {
  args: {
    text: ''
  }
};
