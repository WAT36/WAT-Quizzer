FROM public.ecr.aws/lambda/nodejs:20

ENV DATABASE_URL=$DATABASE_URL

# pnpm（バージョンはルート package.json の packageManager と合わせる）
RUN npm install -g pnpm@12.6.0

# from monorepo root
WORKDIR ${LAMBDA_TASK_ROOT}

COPY ./*.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./

COPY ./quizzer-lib/package.json ./quizzer-lib/

COPY ./backend-nest/package.json ./backend-nest/

# backend-nest とその依存（quizzer-lib）だけをインストール
# ビルドに typescript / nest cli 等が必要なため devDependencies も含める
RUN pnpm install --frozen-lockfile --filter "backend-nest..."

# build quizzer-lib
WORKDIR ${LAMBDA_TASK_ROOT}/quizzer-lib

COPY ./quizzer-lib ./
RUN pnpm run build

# アプリケーションディレクトリを作成する
WORKDIR ${LAMBDA_TASK_ROOT}/backend-nest

COPY ./backend-nest ./

RUN pnpm run build

WORKDIR ${LAMBDA_TASK_ROOT}
CMD [ "/var/task/backend-nest/dist/main.handler" ]
