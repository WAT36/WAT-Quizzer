import Dropzone from 'react-dropzone';
import type { FileRejection } from 'react-dropzone';
import { useState } from 'react';
import { messageState } from '@/atoms/Message';
import { useSetRecoilState } from 'recoil';
import { uploadImageOfQuizAPI } from '@/utils/api-wrapper';
import { QUIZ_IMAGE_LIMITS } from 'quizzer-lib';

interface DropZoneAreaProps {}

const acceptImageTypes = Object.fromEntries(QUIZ_IMAGE_LIMITS.MIME_TYPES.map((type) => [type, []]));

export const DropZoneArea = ({}: DropZoneAreaProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const setMessage = useSetRecoilState(messageState);

  const uploadImage = (file: File) => {
    return uploadImageOfQuizAPI({ uploadQuizRequestData: { file } });
  };

  const handleOnDrop = (files: File[], rejections: FileRejection[]) => {
    // 条件に合わないファイルが1つでもあれば、どれもアップロードしない
    if (rejections.length > 0) {
      setMessage({
        message: `エラー：${QUIZ_IMAGE_LIMITS.MAX_FILE_SIZE_MB}MB以下のPNG・JPEG・GIF・WebP・AVIF画像のみアップロードできます`,
        messageColor: 'error',
        isDisplay: true
      });
      return;
    }

    setIsUploading(true);
    setMessage({
      message: '　',
      messageColor: 'common.black',
      isDisplay: false
    });

    Promise.all(files.map((file) => uploadImage(file)))
      .then((results) => {
        setIsUploading(false);
        // 失敗したファイルごとに、ファイル名とAPIが返したエラー理由をまとめる
        const failures = results
          .map((result, index) => ({ result, file: files[index] }))
          .filter(({ result }) => !result.isSuccess)
          .map(({ result, file }) => `${file.name}: ${result.message?.message ?? '不明なエラー'}`);
        if (failures.length > 0) {
          console.error('画像アップロード失敗', failures);
        }
        setMessage(
          failures.length > 0
            ? {
                message: `エラー：${files.length}件中${failures.length}件のアップロードに失敗しました（${failures.join(' / ')}）`,
                messageColor: 'error',
                isDisplay: true
              }
            : {
                message: `${files.length}件のアップロードが完了しました`,
                messageColor: 'success.light',
                isDisplay: true
              }
        );
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
    <Dropzone
      onDrop={handleOnDrop}
      accept={acceptImageTypes}
      maxSize={QUIZ_IMAGE_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024}
    >
      {({ getRootProps, getInputProps }) => (
        <section>
          <div
            {...getRootProps()}
            className="bg-gray-100 dark:bg-gray-800 m-[10px] p-2.5 border-4 border-dashed border-gray-300 dark:border-gray-600 min-h-[200px] text-center"
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
