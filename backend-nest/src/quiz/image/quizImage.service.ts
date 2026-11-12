import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  getQuizImageFromS3,
  uploadQuizImageToS3,
  UploadImageOfQuizAPIResponseDto,
} from 'quizzer-lib';
import { getQuizImageMimeType } from './quizImageMimeType';

// 問題用の画像(S3)
@Injectable()
export class QuizImageService {
  // 問題用の画像をS3にアップロードする
  async uploadQuizImage(
    file: Express.Multer.File,
  ): Promise<UploadImageOfQuizAPIResponseDto> {
    if (!file) {
      throw new HttpException(
        'アップロードするファイルが指定されていません',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      // 文字列のまま返すとJSONでないレスポンスになりフロントで扱えないため、オブジェクトで返す
      const fileName = await uploadQuizImageToS3(file);
      return { fileName };
    } catch (error: unknown) {
      console.error(error);
      throw new HttpException(
        `画像のアップロードに失敗しました(${file.originalname}): ${
          error instanceof Error ? error.message : String(error)
        }`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 問題用の画像をS3からダウンロードし、base64で返す（取得できなければ404）
  async downloadQuizImage(fileName: string) {
    try {
      const buffer = await getQuizImageFromS3(fileName);
      return {
        base64: buffer.toString('base64'),
        mimeType: getQuizImageMimeType(fileName),
      };
    } catch (error: unknown) {
      console.error(error);
      throw new NotFoundException(`画像が見つかりません(${fileName})`);
    }
  }
}
