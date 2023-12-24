import 'dotenv/config';
import { getDbUrl } from '../aws/secrets';
import { createConnection } from 'mysql2';
import { TransactionQuery } from '../../interfaces/db';

// SQLを実行する
export const execQuery = async (query: string, value: (string | number)[]) => {
  let result;
  // DB接続
  const dbUrl = await getDbUrl();
  const connection = createConnection(dbUrl);

  try {
    // クエリ実行
    result = await new Promise((resolve, reject) => {
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
    // 接続終了しエラーを出す
    await connection.end();
    throw error;
  } finally {
  }
};

// SQLトランザクションを実行する
export const execTransaction = async (queries: TransactionQuery[]) => {
  // DB接続
  const dbUrl = await getDbUrl();
  const connection = createConnection(dbUrl);
  const result = [];
  try {
    // トランザクション開始
    await beginTransaction(connection);
    // クエリ実行
    for (let i = 0; i < queries.length; i++) {
      const { query, value } = queries[i];
      const result_i = await execEachQueryInTransaction(
        connection,
        query,
        value,
      );
      result.push(result_i);
    }
    // コミット
    await commit(connection);
    // 接続終了
    await connection.end();
    return result;
  } catch (error) {
    // ロールバック
    await rollback(connection);
    // 接続終了
    await connection.end();
    throw error;
  }
};

// トランザクション開始
const beginTransaction = (connection) => {
  return new Promise<void>((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// 単クエリ実行
const execEachQueryInTransaction = (connection, statement, params) => {
  return new Promise((resolve, reject) => {
    connection.query(statement, params, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// コミット
const commit = (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

// ロールバック
const rollback = (connection) => {
  return new Promise<void>((resolve, reject) => {
    connection.rollback((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
