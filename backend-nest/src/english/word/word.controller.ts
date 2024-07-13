import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnglishWordService } from './word.service';
import {
  AddEnglishWordAPIRequestDto,
  AddWordTestResultLogAPIRequestDto,
  EditWordSourceAPIRequestDto,
  EditWordMeanAPIRequestDto,
  UpsertWordSubSourceAPIRequestDto,
  DeleteWordSubSourceAPIRequestDto,
  DeleteWordSourceAPIRequestDto,
  DeleteMeanAPIRequestDto,
} from 'quizzer-lib';
// import { AuthGuard } from '../../auth/auth.guard';

@Controller('english/word')
export class EnglishWordController {
  constructor(private readonly englishWordService: EnglishWordService) {}

  @Get('num')
  async getWordNum() {
    return await this.englishWordService.getWordNumService();
  }

  // @UseGuards(AuthGuard)
  @Post()
  async addWord(@Body() req: AddEnglishWordAPIRequestDto) {
    return await this.englishWordService.addWordAndMeanService(req);
  }

  // @UseGuards(AuthGuard)
  @Get('search')
  async searchWord(
    @Query('wordName') wordName: string,
    @Query('meanQuery') meanQuery: string,
    @Query('subSourceName') subSourceName: string,
  ) {
    return await this.englishWordService.searchWordService(
      wordName,
      meanQuery,
      subSourceName,
    );
  }

  // @UseGuards(AuthGuard)
  @Get('random')
  async getRandomWord() {
    return await this.englishWordService.getRandomWordService();
  }

  // @UseGuards(AuthGuard)
  @Get()
  async getAllWord() {
    return await this.englishWordService.getAllWordService();
  }

  // @UseGuards(AuthGuard)
  @Get('byname')
  async getWordByName(@Query('name') name: string) {
    return await this.englishWordService.getWordByNameService(name);
  }

  // @UseGuards(AuthGuard)
  @Get('test/fourchoice')
  async getTestDataOfFourChoice(
    @Query('source') source: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.englishWordService.getTestDataOfFourChoice(
      source,
      startDate,
      endDate,
    );
  }

  // @UseGuards(AuthGuard)
  @Get('test/fourchoice/lru')
  async getLRUTestDataOfFourChoice(
    @Query('source') source: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.englishWordService.getLRUTestDataOfFourChoice(
      source,
      startDate,
      endDate,
    );
  }

  // @UseGuards(AuthGuard)
  @Post('test/clear')
  async wordTestCleared(@Body() req: AddWordTestResultLogAPIRequestDto) {
    return await this.englishWordService.wordTestClearedService(req);
  }

  // @UseGuards(AuthGuard)
  @Post('test/fail')
  async wordTestFailed(@Body() req: AddWordTestResultLogAPIRequestDto) {
    return await this.englishWordService.wordTestFailedService(req);
  }

  // @UseGuards(AuthGuard)
  @Post('source')
  async editSourceOfWordById(@Body() req: EditWordSourceAPIRequestDto) {
    return await this.englishWordService.editSourceOfWordById(req);
  }

  // @UseGuards(AuthGuard)
  @Delete('source')
  async deleteSourceOfWordById(@Body() req: DeleteWordSourceAPIRequestDto) {
    return await this.englishWordService.deleteSourceOfWordById(req);
  }

  // @UseGuards(AuthGuard)
  @Post('subsource')
  async addSubSourceOfWordById(@Body() req: UpsertWordSubSourceAPIRequestDto) {
    return await this.englishWordService.upsertSubSourceOfWordById(req);
  }

  // @UseGuards(AuthGuard)
  @Delete('subsource')
  async deleteSubSourceOfWordById(
    @Body() req: DeleteWordSubSourceAPIRequestDto,
  ) {
    return await this.englishWordService.deleteSubSourceOfWordById(req);
  }

  // @UseGuards(AuthGuard)
  @Delete('mean')
  async deleteWordMeanById(@Body() req: DeleteMeanAPIRequestDto) {
    return await this.englishWordService.deleteMeandById(req);
  }

  // @UseGuards(AuthGuard)
  @Get('summary')
  async getSummary() {
    return await this.englishWordService.getSummary();
  }

  /* 注 以下APIは一番最後に置くこと パスが上書きされて全てこのAPIが使われてしまうため */
  // @UseGuards(AuthGuard)
  @Get('source/:id')
  async getSourceOfWordById(@Param('id') id: string) {
    return await this.englishWordService.getSourceOfWordById(+id);
  }

  // @UseGuards(AuthGuard)
  @Get('subsource/:id')
  async getSubSourceOfWordById(@Param('id') id: string) {
    return await this.englishWordService.getSubSourceOfWordById(+id);
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  async getWordById(@Param('id') id: string) {
    return await this.englishWordService.getWordByIdService(+id);
  }

  // @UseGuards(AuthGuard)
  @Patch(':id')
  async editWordMean(@Body() req: EditWordMeanAPIRequestDto) {
    return await this.englishWordService.editWordMeanService(req);
  }
}
