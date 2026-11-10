import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import {
  GetEnglishWordTestDataAPIRequestDto,
  GetEnglishWordTestDataAPIRequestReceivedDto,
  parseStrToBool,
} from 'quizzer-lib';

const TEST_FORMATS: GetEnglishWordTestDataAPIRequestDto['format'][] = [
  'random',
  'lru',
  'review',
];
const isTestFormat = (
  format: string,
): format is GetEnglishWordTestDataAPIRequestDto['format'] =>
  (TEST_FORMATS as string[]).includes(format);

@Injectable()
export class WordTestPipe implements PipeTransform<
  GetEnglishWordTestDataAPIRequestReceivedDto,
  GetEnglishWordTestDataAPIRequestDto
> {
  transform(
    wordTestRequestDTO: GetEnglishWordTestDataAPIRequestReceivedDto,
  ): GetEnglishWordTestDataAPIRequestDto {
    const { format } = wordTestRequestDTO;
    if (!isTestFormat(format)) {
      throw new BadRequestException(`format が不正です(${format})`);
    }
    return Object.entries(
      wordTestRequestDTO,
    ).reduce<GetEnglishWordTestDataAPIRequestDto>(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'min_rate':
          case 'max_rate':
          case 'result_from':
          case 'result_to':
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
      { format },
    );
  }
}
