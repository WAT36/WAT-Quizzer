import React from 'react';

interface TitleProps {
  label: string;
}

export const Title = ({ ...props }: TitleProps) => {
  return <h1>{props.label}</h1>;
};
