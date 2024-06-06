import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
// import express from 'express';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// import schema from '../prisma/schema.prisma';
// // import x from '../../node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node';
// import x from '../prisma/libquery_engine-rhel-openssl-3.0.x.so.node';

// if (process.env.NODE_ENV !== 'production') {
//   console.debug(schema, x);
// }

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    nestApp.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
      );
      next();
    });
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

// Lambda handler
export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const config = new DocumentBuilder().build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  // app.use(cookieParser());
  app.enableCors({
    origin: '*',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, x-api-key, Authorization',
  });
  await app.listen(4000);
}

if (process.env.APP_ENV == 'local') {
  bootstrap();
}
