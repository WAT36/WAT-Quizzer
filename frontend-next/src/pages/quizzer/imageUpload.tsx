import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

import QuizzerLayout from './components/QuizzerLayout';
import { messageBoxStyle, dropzoneStyle } from '../../styles/Pages';
import { ImageUploadReturnValue } from '../../../../interfaces/api';
import { Card, CardContent, Container, Typography } from '@mui/material';

export default function ImageUploadPage() {
  const [message, setMessage] = useState<string>('　');
  const [messageColor, setMessageColor] = useState<string>('common.black');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageUploadReturnValue[]>([]);

  const handleOnDrop = (files: File[]) => {
    setIsUploading(true);
    setMessage('　');
    setMessageColor('common.black');

    Promise.all(files.map((file) => uploadImage(file)))
      .then((image) => {
        setIsUploading(false);
        setImages(images.concat(image));
        setMessage('アップロードが完了しました:' + image[0].name);
        setMessageColor('success.light');
      })
      .catch((e) => {
        console.error(e);
        setIsUploading(false);
        setMessage('エラー：アップロードに失敗しました');
        setMessageColor('error');
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
        <h1>WAT Quizzer</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={messageColor}>
              {message}
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
      <QuizzerLayout contents={contents()} title={'画像アップロード'} />
    </>
  );
}
