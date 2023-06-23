import 'dotenv/config';
import { getDbUrl } from 'lib/aws/secrets';
import { createConnection } from 'mysql2';

// SQLを実行する
export const execQuery = async (query: string, value: (string | number)[]) => {
  try {
    // DB接続
    const dbUrl = await getDbUrl();
    const connection = createConnection(dbUrl);

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
