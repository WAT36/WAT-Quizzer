import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodType, z } from 'zod';

// 受け取った値をZodスキーマで検証し、通ればスキーマで変換した後の値を返す
// 通らなければ400（フロントはmessageの文字列を画面に出すので、項目名と理由を1行にまとめる）
export class ZodValidationPipe<T extends ZodType> implements PipeTransform<
  unknown,
  z.output<T>
> {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.output<T> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(formatZodIssues(result.error.issues));
    }
    return result.data;
  }
}

// 「項目名: 理由」を「 / 」でつなぐ。値そのものが不正（項目名なし）の場合は理由だけ
export const formatZodIssues = (issues: z.core.$ZodIssue[]): string =>
  issues
    .map((issue) =>
      issue.path.length > 0
        ? `${issue.path.map(String).join('.')}: ${issue.message}`
        : issue.message,
    )
    .join(' / ');
