import type { Meta, StoryObj } from '@storybook/nextjs';
import { NewPasswordForm } from './NewPasswordForm';

const meta: Meta<typeof NewPasswordForm> = {
  title: 'ui-forms/login/newPasswordForm/NewPasswordForm',
  component: NewPasswordForm,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

// デフォルトのストーリー
export const Default: StoryObj<typeof NewPasswordForm> = {
  args: {
    username: 'dummyuser',
    session: 'dummy-session'
  }
};
