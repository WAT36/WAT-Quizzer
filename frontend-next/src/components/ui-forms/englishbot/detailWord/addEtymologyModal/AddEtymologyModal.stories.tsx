import type { Meta, StoryObj } from '@storybook/nextjs';
import { AddEtymologyModal } from './AddEtymologyModal';

const meta = {
  title: 'Molecules/EnglishBot/DetailWord/AddEtymologyModal',
  component: AddEtymologyModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof AddEtymologyModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    setIsOpen: () => {}
  }
};
