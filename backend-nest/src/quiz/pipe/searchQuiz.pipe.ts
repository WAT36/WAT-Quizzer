import { PipeTransform, Injectable } from '@nestjs/common';
import {
  parseStrToBool,
  SearchQuizAPIRequestDto,
  SearchQuizAPIRequestReceivedDto,
} from 'quizzer-lib';

@Injectable()
export class SearchQuizPipe
  implements
    PipeTransform<SearchQuizAPIRequestReceivedDto, SearchQuizAPIRequestDto>
{
  transform(
    searchQuizDTO: SearchQuizAPIRequestReceivedDto,
  ): SearchQuizAPIRequestDto {
    return Object.entries(searchQuizDTO).reduce(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'file_num':
          case 'format_id':
          case 'min_rate':
          case 'max_rate':
            if (cur[1] === '-1' || isNaN(parseInt(cur[1]))) {
              return { ...acc };
            } else {
              return { ...acc, [key]: parseInt(cur[1]) };
            }
          case 'checked':
          case 'searchInOnlySentense':
          case 'searchInOnlyAnswer':
            return { ...acc, [key]: parseStrToBool(cur[1]) };
          default:
            if (cur[1] === '-1') {
              return { ...acc };
            } else {
              return { ...acc, [key]: cur[1] };
            }
        }
      },
      { query: '', file_num: -1 },
    );
  }
}
