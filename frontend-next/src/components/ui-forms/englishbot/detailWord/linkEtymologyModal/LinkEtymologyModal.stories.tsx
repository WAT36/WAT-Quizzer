import type { Meta, StoryObj } from '@storybook/nextjs';
import { LinkEtymologyModal } from './LinkEtymologyModal';
import { mockWordDetailWithAntonyms } from 'quizzer-lib';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/LinkEtymologyModal',
  component: LinkEtymologyModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof LinkEtymologyModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {},
    wordDetail: mockWordDetailWithAntonyms
  }
};
