import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { QUIZ_IMAGE_LIMITS } from 'quizzer-lib';

// 問題画像アップロードで受け付けるファイルの条件
// サイズ超過はFileInterceptorが413エラーにする
export const quizImageUploadOptions: MulterOptions = {
  // multerは上限ちょうどのサイズも超過として扱うので、上限ちょうどを通すため1バイト足す
  limits: { fileSize: QUIZ_IMAGE_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024 + 1 },
  fileFilter: (_req, file, callback) => {
    if (QUIZ_IMAGE_LIMITS.MIME_TYPES.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException('アップロードできない形式のファイルです'),
        false,
      );
    }
  },
};
