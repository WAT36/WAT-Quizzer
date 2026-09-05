import React from 'react';

interface TitleProps {
  label: string;
}

export const Title = ({ ...props }: TitleProps) => {
  return <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{props.label}</h1>;
};
