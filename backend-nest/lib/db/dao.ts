import 'dotenv/config';
import { createConnection } from 'mysql2';

// SQLを実行する
export const execQuery = async (query: string, value: (string | number)[]) => {
  try {
    // DB接続
    const connection = createConnection(process.env.DATABASE_URL);

    // クエリ実行
    const result = await new Promise((resolve, reject) => {
      connection.query(query, value, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });

    // 接続終了
    await connection.end();
    return result;
  } catch (error) {
    throw error;
  }
};
