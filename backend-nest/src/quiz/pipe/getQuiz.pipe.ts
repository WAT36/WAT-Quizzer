import { PipeTransform, Injectable } from '@nestjs/common';
import {
  GetQuizAPIRequestParsedDto,
  GetQuizAPIRequestReceivedDto,
  parseStrToBool,
} from 'quizzer-lib';
import { parseFormatIds } from '../../common/formatId';

@Injectable()
export class GetQuizPipe implements PipeTransform<
  GetQuizAPIRequestReceivedDto,
  GetQuizAPIRequestParsedDto
> {
  transform(
    getQuizDTO: GetQuizAPIRequestReceivedDto,
  ): GetQuizAPIRequestParsedDto {
    return Object.entries(getQuizDTO).reduce(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'file_num':
          case 'quiz_num':
          case 'min_rate':
          case 'max_rate':
          case 'count':
            if (cur[1] === '-1' || isNaN(parseInt(cur[1]))) {
              return { ...acc };
            } else {
              return { ...acc, [key]: parseInt(cur[1]) };
            }
          case 'checked':
            return { ...acc, [key]: parseStrToBool(cur[1]) };
          case 'format_id': {
            const formatIds = parseFormatIds(cur[1]);
            return formatIds ? { ...acc, [key]: formatIds } : { ...acc };
          }
          default:
            if (cur[1] === '-1') {
              return { ...acc };
            } else {
              return { ...acc, [key]: cur[1] };
            }
        }
      },
      { file_num: -1 },
    );
  }
}
