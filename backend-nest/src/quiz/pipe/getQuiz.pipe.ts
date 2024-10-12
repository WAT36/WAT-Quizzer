import { PipeTransform, Injectable } from '@nestjs/common';
import {
  GetQuizAPIRequestDto,
  GetQuizAPIRequestReceivedDto,
  parseStrToBool,
} from 'quizzer-lib';

@Injectable()
export class GetQuizPipe
  implements PipeTransform<GetQuizAPIRequestReceivedDto, GetQuizAPIRequestDto>
{
  transform(getQuizDTO: GetQuizAPIRequestReceivedDto): GetQuizAPIRequestDto {
    return Object.entries(getQuizDTO).reduce(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'file_num':
          case 'quiz_num':
          case 'format_id':
          case 'min_rate':
          case 'max_rate':
            if (cur[1] === '-1' || isNaN(parseInt(cur[1]))) {
              return { ...acc };
            } else {
              return { ...acc, [key]: parseInt(cur[1]) };
            }
          case 'checked':
            return { ...acc, [key]: parseStrToBool(cur[1]) };
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
