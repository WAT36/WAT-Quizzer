import { PipeTransform, Injectable } from '@nestjs/common';
import {
  GetAnswerLogStatisticsAPIRequestDto,
  GetAnswerLogStatisticsAPIRequestReceivedDto,
} from 'quizzer-lib';

@Injectable()
export class GetAnswerLogStatisticsPipe implements PipeTransform<
  GetAnswerLogStatisticsAPIRequestReceivedDto,
  GetAnswerLogStatisticsAPIRequestDto
> {
  transform(
    getAnswerLogStatisticsDTO: GetAnswerLogStatisticsAPIRequestReceivedDto,
  ): GetAnswerLogStatisticsAPIRequestDto {
    return Object.entries(
      getAnswerLogStatisticsDTO,
    ).reduce<GetAnswerLogStatisticsAPIRequestDto>(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'file_num':
            if (cur[1] === '-1' || isNaN(parseInt(cur[1]))) {
              return { ...acc };
            } else {
              return { ...acc, [key]: parseInt(cur[1]) };
            }
          case 'date_unit':
            if (cur[1] === 'day' || cur[1] === 'month' || cur[1] === 'week') {
              return { ...acc, [key]: cur[1] };
            } else {
              return { ...acc };
            }
          default:
            return { ...acc };
        }
      },
      { file_num: -1, date_unit: 'day' },
    );
  }
}
