FROM node:18

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max-old-space-size=16384

# from monorepo root
WORKDIR /app

COPY ./package*.json ./

COPY ./quizzer-lib/package*.json ./quizzer-lib/

COPY ./backend-nest/package*.json ./backend-nest/

RUN npm ci --production

# build quizzer-lib
WORKDIR /app/quizzer-lib

COPY ./quizzer-lib ./

RUN npm run build

# アプリケーションディレクトリを作成する
WORKDIR /app/backend-nest

COPY ./backend-nest ./

RUN npm run build

EXPOSE 4000

CMD [ "npm", "run","start" ]
