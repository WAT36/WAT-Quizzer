import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SayingService } from './saying.service';
import {
  AddBookAPIRequestDto,
  addBookAPIRequestSchema,
  AddSayingAPIRequestDto,
  addSayingAPIRequestSchema,
  EditSayingAPIRequestDto,
  editSayingAPIRequestSchema,
} from 'quizzer-lib';
import { ZodValidationPipe } from '../common/zodValidation.pipe';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { ApiOperation, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Saying（格言関連API）')
@UseGuards(CognitoAuthGuard)
@Controller('saying')
export class SayingController {
  constructor(private readonly sayingService: SayingService) {}

  @Get()
  @ApiOperation({
    summary: '格言を取得します。本IDを指定しない場合はランダムで取得します。',
  })
  @ApiQuery({
    name: 'book_id',
    required: false,
    description: '本ID（オプション）',
  })
  async getSaying(
    @Query('book_id', new ParseIntPipe({ optional: true })) book_id?: number,
  ) {
    return await this.sayingService.getRandomSaying(book_id);
  }

  @Post('/book')
  @ApiOperation({ summary: '啓発本を追加します。' })
  async addBook(
    @Body(new ZodValidationPipe(addBookAPIRequestSchema))
    req: AddBookAPIRequestDto,
  ) {
    return await this.sayingService.addBookService(req);
  }

  @Get('/book')
  @ApiOperation({ summary: '啓発本のリストを取得します。' })
  async getBookList() {
    return await this.sayingService.getBookListService();
  }

  @Post()
  @ApiOperation({ summary: '格言を追加します。' })
  async addSaying(
    @Body(new ZodValidationPipe(addSayingAPIRequestSchema))
    req: AddSayingAPIRequestDto,
  ) {
    return await this.sayingService.addSayingService(req);
  }

  @Get('/search')
  @ApiOperation({ summary: '格言をキーワードで検索します。' })
  @ApiQuery({ name: 'saying', required: true, description: '検索キーワード' })
  async searchSaying(@Query('saying') saying: string) {
    return await this.sayingService.searchSayingService(saying);
  }

  @Patch()
  @ApiOperation({ summary: '格言を編集します。' })
  async editSaying(
    @Body(new ZodValidationPipe(editSayingAPIRequestSchema))
    req: EditSayingAPIRequestDto,
  ) {
    return await this.sayingService.editSayingService(req);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'ファイルをアップロードします。' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.sayingService.uploadFile(file);
  }

  @Get('/:id')
  @ApiOperation({ summary: '格言IDを指定して格言を取得します。' })
  @ApiParam({ name: 'id', type: Number, description: '格言ID' })
  async getSayingById(@Param('id', ParseIntPipe) id: number) {
    return await this.sayingService.getSayingByIdService(+id);
  }
}
