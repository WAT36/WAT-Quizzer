import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { parseFormatIds } from '../../common/formatId';

export interface AccuracyRateQueryDto {
  file_num: number;
  startDate?: Date;
  endDate?: Date;
  format_id?: number[];
}

@Injectable()
export class AccuracyRateQueryPipe implements PipeTransform {
  transform(value: any): AccuracyRateQueryDto {
    const { file_num, startDate, endDate, format_id } = value;

    // file_numの検証と変換（必須）
    if (!file_num) {
      throw new BadRequestException('file_num is required');
    }
    const fileNum = parseInt(file_num, 10);
    if (isNaN(fileNum)) {
      throw new BadRequestException('file_num must be a valid number');
    }

    // startDateの検証と変換（オプショナル）
    let startDateObj: Date | undefined;
    if (startDate) {
      startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        throw new BadRequestException(
          'startDate must be a valid date in yyyy-mm-dd format',
        );
      }
    }

    // endDateの検証と変換（オプショナル）
    let endDateObj: Date | undefined;
    if (endDate) {
      endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        throw new BadRequestException(
          'endDate must be a valid date in yyyy-mm-dd format',
        );
      }
    }

    // 両方の日付が提供されている場合のみ、日付の妥当性チェック
    if (startDateObj && endDateObj && startDateObj > endDateObj) {
      throw new BadRequestException(
        'startDate must be before or equal to endDate',
      );
    }

    // format_idの検証と変換（オプショナル）
    const formatIds = parseFormatIds(format_id);

    return {
      file_num: fileNum,
      startDate: startDateObj,
      endDate: endDateObj,
      format_id: formatIds,
    };
  }
}
