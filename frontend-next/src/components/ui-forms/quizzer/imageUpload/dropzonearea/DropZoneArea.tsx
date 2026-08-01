import Dropzone from 'react-dropzone';
import { useState } from 'react';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { uploadImageOfQuizAPI } from '@/utils/api-wrapper';

interface DropZoneAreaProps {}

// TODO  画像アップロードだが回数制限を設けた方がいいと思う、何かあった時用に
export const DropZoneArea = ({}: DropZoneAreaProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const setMessage = useSetRecoilState(messageState);

  const uploadImage = (file: File) => {
    return uploadImageOfQuizAPI({ uploadQuizRequestData: { file } });
  };

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
        setMessage({
          message: `${files.length}件のアップロードが完了しました`,
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

  return (
    <Dropzone onDrop={handleOnDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div
            {...getRootProps()}
            className="bg-gray-100 m-[10px] p-2.5 border-4 border-dashed border-gray-300 min-h-[200px] text-center"
          >
            <input {...getInputProps({ 'aria-label': '画像ファイルを選択' })} />
            <p>Drag and drop some files here, or click to select files</p>
            {isUploading ? <p>ファイルをアップロードしています</p> : <p>ここに画像をドラックまたはクリック</p>}
          </div>
        </section>
      )}
    </Dropzone>
  );
};
