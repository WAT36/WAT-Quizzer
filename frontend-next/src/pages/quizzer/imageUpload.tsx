import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

import { messageBoxStyle, dropzoneStyle } from '../../styles/Pages';
import { ImageUploadReturnValue } from '../../../interfaces/api/response';
import { Card, CardContent, Container, Typography } from '@mui/material';
import { Layout } from '@/components/templates/layout/Layout';
import { MessageState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';

export default function ImageUploadPage() {
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageUploadReturnValue[]>([]);

  const handleOnDrop = (files: File[]) => {
    setIsUploading(true);
    setMessage({
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    });

    Promise.all(files.map((file) => uploadImage(file)))
      .then((image) => {
        setIsUploading(false);
        setImages(images.concat(image));
        setMessage({
          message: 'アップロードが完了しました:' + image[0].name,
          messageColor: 'success.light',
          isDisplay: true
        });
      })
      .catch((e) => {
        console.error(e);
        setIsUploading(false);
        setMessage({
          message: 'エラー：アップロードに失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      });
  };

  const uploadImage = (file: File) => {
    return axios
      .post(process.env.NEXT_PUBLIC_API_SERVER + '/upload', {
        params: {
          filename: file.name,
          filetype: file.type
        }
      })
      .then((res) => {
        const options = {
          headers: {
            'Content-Type': file.type
          }
        };
        return axios.put(res.data.url, file, options);
      })
      .then((res) => {
        const name = String(res.config.data);
        return {
          name,
          isUploading: true,
          url: 'https://' + process.env.NEXT_PUBLIC_S3_BUCKET_NAME + `.s3.amazonaws.com/${file.name}`
        } as ImageUploadReturnValue;
      })
      .catch((e) => {
        console.log('frontend axioserrpr:', e);
        return {} as ImageUploadReturnValue;
      });
  };

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={message.messageColor}>
              {message.message}
            </Typography>
          </CardContent>
        </Card>

        <Dropzone onDrop={handleOnDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <p>Drag and drop some files here, or click to select files</p>
                {isUploading ? <p>ファイルをアップロードしています</p> : <p>ここに画像をドラックまたはクリック</p>}
              </div>
            </section>
          )}
        </Dropzone>
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
