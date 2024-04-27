FROM node:18

# アプリケーションディレクトリを作成する
WORKDIR /app

COPY package*.json ./
# TODO これはやめたい　libはnpmにあげた方が良いか？
COPY quizzer-lib*.tgz ./
# RUN npm install ./quizzer-lib*.tgz
RUN npm ci --production

# TypeScript コードをコピーしてビルド
COPY . .
# RUN rm quizzer-lib*.tgz # このtgz消すと使えなくなるので、消さずに残す
RUN npm run build

EXPOSE 4000

CMD [ "npm", "run","start" ]
