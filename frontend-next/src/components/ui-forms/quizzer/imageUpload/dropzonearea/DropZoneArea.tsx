import Dropzone from 'react-dropzone';
import { MessageState } from '../../../../../../interfaces/state';
import { ImageUploadReturnValue } from '../../../../../../interfaces/api/response';
import axios from 'axios';
import styles from './DropZoneArea.module.css';

interface DropZoneAreaProps {
  images: ImageUploadReturnValue[];
  isUploading: boolean;
  setImages?: React.Dispatch<React.SetStateAction<ImageUploadReturnValue[]>>;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setIsUploading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropZoneArea = ({ images, isUploading, setImages, setMessage, setIsUploading }: DropZoneAreaProps) => {
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

  const handleOnDrop = (files: File[]) => {
    setIsUploading && setIsUploading(true);
    setMessage &&
      setMessage({
        message: '　',
        messageColor: 'common.black',
        isDisplay: false
      });

    Promise.all(files.map((file) => uploadImage(file)))
      .then((image) => {
        setIsUploading && setIsUploading(false);
        setImages && setImages(images.concat(image));
        setMessage &&
          setMessage({
            message: 'アップロードが完了しました:' + image[0].name,
            messageColor: 'success.light',
            isDisplay: true
          });
      })
      .catch((e) => {
        console.error(e);
        setIsUploading && setIsUploading(false);
        setMessage &&
          setMessage({
            message: 'エラー：アップロードに失敗しました',
            messageColor: 'error',
            isDisplay: true
          });
      });
  };

  return (
    <Dropzone onDrop={handleOnDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()} className={styles.dropzone}>
            <input {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
            {isUploading ? <p>ファイルをアップロードしています</p> : <p>ここに画像をドラックまたはクリック</p>}
          </div>
        </section>
      )}
    </Dropzone>
  );
};
