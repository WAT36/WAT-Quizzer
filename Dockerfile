FROM public.ecr.aws/lambda/nodejs:20

ENV DATABASE_URL=$DATABASE_URL

# from monorepo root
WORKDIR ${LAMBDA_TASK_ROOT}

COPY ./package*.json ./

COPY ./quizzer-lib/package*.json ./quizzer-lib/

COPY ./backend-nest/package*.json ./backend-nest/

RUN npm install --production

# build quizzer-lib
WORKDIR ${LAMBDA_TASK_ROOT}/quizzer-lib

COPY ./quizzer-lib ./

RUN npm run build

# アプリケーションディレクトリを作成する
WORKDIR ${LAMBDA_TASK_ROOT}/backend-nest

COPY ./backend-nest ./

RUN npm run build

WORKDIR ${LAMBDA_TASK_ROOT}
CMD [ "/var/task/backend-nest/dist/main.handler" ]
