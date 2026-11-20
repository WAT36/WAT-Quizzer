import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  generateAutoQuizImageFileName,
  ImportImageOfQuizAPIRequestDto,
  ImportImageOfQuizAPIResponseDto,
  prisma,
  putQuizImageToS3,
  QUIZ_IMAGE_LIMITS,
} from 'quizzer-lib';
import { verifyImageCandidate } from '../search/candidateSignature';
import { DetectedImageType, detectImageType } from './imageType';
import { DownloadError, downloadExternalFile } from './safeImageDownload';

const MAX_BYTES = QUIZ_IMAGE_LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024;

interface DownloadedImage {
  body: Buffer;
  type: DetectedImageType;
}

// URLの画像をダウンロードし、対応している画像か確認する。だめなら理由を返す
const downloadImage = async (
  url: string,
): Promise<DownloadedImage | { failure: string }> => {
  try {
    const { body } = await downloadExternalFile(url, { maxBytes: MAX_BYTES });
    const type = detectImageType(body);
    return type ? { body, type } : { failure: '対応していない形式です' };
  } catch (error: unknown) {
    if (error instanceof DownloadError) return { failure: error.message };
    throw error;
  }
};

// Webで見つけた候補の画像を保存し、問題に紐付ける
@Injectable()
export class QuizImageImportService {
  async importImage({
    quiz_id,
    image_url,
    thumbnail_url,
    signature,
  }: ImportImageOfQuizAPIRequestDto): Promise<ImportImageOfQuizAPIResponseDto> {
    // 候補取得APIが返した組み合わせでなければ、URLを取りに行かない
    if (
      !verifyImageCandidate(
        { quizId: quiz_id, imageUrl: image_url, thumbnailUrl: thumbnail_url },
        signature,
      )
    ) {
      throw new BadRequestException(
        '画像の候補が不正か、有効期限が切れています。もう一度検索してください',
      );
    }

    const quiz = await prisma.quiz.findFirst({
      select: { id: true },
      where: { id: quiz_id, deleted_at: null },
    });
    if (!quiz) {
      throw new NotFoundException(`問題が見つかりません(id:${quiz_id})`);
    }

    // 元画像を取得できなければ（直リンク禁止・サイズ超過など）サムネイルで取り直す
    let image = await downloadImage(image_url);
    if ('failure' in image && thumbnail_url) {
      const thumbnail = await downloadImage(thumbnail_url);
      if (!('failure' in thumbnail)) image = thumbnail;
    }
    if ('failure' in image) {
      console.error(`画像の取得に失敗しました(${image_url}): ${image.failure}`);
      throw new UnprocessableEntityException(
        `この画像は取得できませんでした(${image.failure})。別の画像を選んでください`,
      );
    }

    const fileName = generateAutoQuizImageFileName(
      quiz_id,
      image.type.extension,
    );
    try {
      await putQuizImageToS3(fileName, image.body, image.type.mimeType);
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException(
        `画像の保存に失敗しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    await prisma.quiz.update({
      where: { id: quiz_id },
      data: { img_file: fileName },
    });
    return { fileName };
  }
}
