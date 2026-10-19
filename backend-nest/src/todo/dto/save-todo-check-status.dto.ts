import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, Matches } from 'class-validator';

export class SaveTodoCheckStatusDto {
  @ApiProperty({ description: '日付 (YYYY-MM-DD)' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '日付はYYYY-MM-DD形式で入力してください',
  })
  date: string;

  @ApiProperty({ description: '完了したTodo IDの配列', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  completedTodoIds: number[];
}
