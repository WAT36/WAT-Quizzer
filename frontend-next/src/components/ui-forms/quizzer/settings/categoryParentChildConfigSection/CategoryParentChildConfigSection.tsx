import React from 'react';
import { SettingsCard } from '../settingsCard/SettingsCard';
import { CategoryParentChildSection } from '../categoryParentChildSection/CategoryParentChildSection';
import type { PullDownOptionDto, Message } from 'quizzer-lib';

interface CategoryParentChildConfigSectionProps {
  filelistoption: PullDownOptionDto[];
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export const CategoryParentChildConfigSection = ({
  filelistoption,
  setMessage,
}: CategoryParentChildConfigSectionProps) => {
  return (
    <SettingsCard title="カテゴリ親子関係">
      <CategoryParentChildSection filelistoption={filelistoption} setMessage={setMessage} />
    </SettingsCard>
  );
};
