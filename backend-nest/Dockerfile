FROM node:16

# アプリケーションディレクトリを作成する
WORKDIR /app

COPY package*.json ./
RUN npm install

# TypeScript コードをコピーしてビルド
COPY . .
RUN npm run build

EXPOSE 4000

CMD [ "npm", "run","start:dev" ]