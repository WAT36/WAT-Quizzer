import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  INestApplication,
  Logger,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AllExceptionsFilter } from './allExceptions.filter';

@Controller()
class TestController {
  @Get('http-error')
  httpError() {
    throw new HttpException('入力が不正です', HttpStatus.BAD_REQUEST);
  }

  @Get('http-error-object')
  httpErrorObject() {
    throw new HttpException(
      { errors: ['1行目: エラー'] },
      HttpStatus.BAD_REQUEST,
    );
  }

  @Get('error')
  error() {
    throw new Error('DB error');
  }

  @Get('non-error')
  nonError() {
    throw 'string error';
  }
}

describe('AllExceptionsFilter', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
      providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('HttpExceptionはステータス・内容をそのまま返す', async () => {
    const res = await request(app.getHttpServer()).get('/http-error');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ statusCode: 400, message: '入力が不正です' });
  });

  it('オブジェクトを渡したHttpExceptionはそのオブジェクトを返す', async () => {
    const res = await request(app.getHttpServer()).get('/http-error-object');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ errors: ['1行目: エラー'] });
  });

  it('Errorはメッセージ付きの500にする', async () => {
    const res = await request(app.getHttpServer()).get('/error');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ statusCode: 500, message: 'DB error' });
  });

  it('Error以外が投げられても500にする', async () => {
    const res = await request(app.getHttpServer()).get('/non-error');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      statusCode: 500,
      message: 'Internal server error',
    });
  });
});
