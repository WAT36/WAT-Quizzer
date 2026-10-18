import { PipeTransform, Injectable } from '@nestjs/common';
import {
  parseStrToBool,
  SearchQuizAPIRequestDto,
  SearchQuizAPIRequestReceivedDto,
} from 'quizzer-lib';

// JSON文字列化されたカテゴリ名配列をパースする（不正な値は無視し、トリム・空文字除去・重複除去する）
const parseCategoryList = (value: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return Array.from(
      new Set(
        parsed
          .filter((x): x is string => typeof x === 'string')
          .map((x) => x.trim())
          .filter((x) => x !== ''),
      ),
    );
  } catch {
    return [];
  }
};

@Injectable()
export class SearchQuizPipe implements PipeTransform<
  SearchQuizAPIRequestReceivedDto,
  SearchQuizAPIRequestDto
> {
  transform(
    searchQuizDTO: SearchQuizAPIRequestReceivedDto,
  ): SearchQuizAPIRequestDto {
    return Object.entries(searchQuizDTO).reduce(
      (acc, cur) => {
        const key = cur[0];
        switch (key) {
          case 'file_num':
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
          case 'searchInOnlySentense':
          case 'searchInOnlyAnswer':
          case 'searchInExplanation':
          case 'onlyDirectCategory':
            return { ...acc, [key]: parseStrToBool(cur[1]) };
          case 'format_id':
            return cur[1] && cur[1] !== ''
              ? {
                  ...acc,
                  [key]: cur[1]
                    .split(',')
                    .filter((x) => x !== '')
                    .reduce((accummulate, currentValue) => {
                      return { ...accummulate, [currentValue]: true };
                    }, {}),
                }
              : {
                  ...acc,
                };
          case 'category_and':
          case 'category_not': {
            const categories = parseCategoryList(cur[1]);
            return categories.length > 0
              ? { ...acc, [key]: categories }
              : { ...acc };
          }
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
