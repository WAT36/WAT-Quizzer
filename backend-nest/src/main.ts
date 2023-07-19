import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';

const binaryMimeTypes: string[] = [];
let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    nestApp.setGlobalPrefix('v1');
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
export const handler = async (event: any, context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, x-api-key',
  });
  await app.listen(4000);
}

if (process.env.APP_ENV == 'local') {
  bootstrap();
}
