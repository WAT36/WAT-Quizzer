import React, { useState } from 'react';
import { ImageUploadReturnValue } from '../../../interfaces/api/response';
import { Container } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { DropZoneArea } from '@/components/ui-forms/quizzer/imageUpload/dropzonearea/DropZoneArea';

export default function ImageUploadPage() {
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageUploadReturnValue[]>([]);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <DropZoneArea
          images={images}
          isUploading={isUploading}
          setImages={setImages}
          setMessage={setMessage}
          setIsUploading={setIsUploading}
        />
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'画像アップロード'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
