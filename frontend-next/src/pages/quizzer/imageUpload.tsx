import React from 'react';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { Title } from '@/components/ui-elements/title/Title';
import { DropZoneArea } from '@/components/ui-forms/quizzer/imageUpload/dropzonearea/DropZoneArea';

export default function ImageUploadPage() {
  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <DropZoneArea />
      </Container>
    );
  };

  return <Layout mode="quizzer" contents={contents()} title={'画像アップロード'} />;
}
