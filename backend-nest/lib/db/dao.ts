// TODO prismaにしたからここ不要？　あとで使うかもなので一応コメントして残す

// import 'dotenv/config';
// import { gerPostgreDbClient } from '../aws/secrets';
// import { TransactionQuery } from '../../interfaces/db';
// import { Client } from 'pg';

// // SQLを実行する
// export const execQuery = async (query: string, value: (string | number)[]) => {
//   // DB接続
//   const dbJson = await gerPostgreDbClient();
//   const client = new Client(dbJson);
//   await client.connect();

//   // SQL中の?をpostgre用の$1,$2,$3,,,に置き換え
//   let replacedQuery = query;
//   for (let num = 1; num <= 10; num++) {
//     if (replacedQuery.includes('?')) {
//       replacedQuery = replacedQuery.replace('?', '$' + String(num));
//     } else {
//       break;
//     }
//   }
//   const queryObj = {
//     text: replacedQuery,
//     values: value,
//   };

//   try {
//     // クエリ実行
//     const result: any = await client.query(queryObj);
//     await client.end();
//     return result.rows;
//   } catch (error) {
//     // 接続終了
//     await client.end();
//     throw error;
//   }
// };

// // SQLトランザクションを実行する
// export const execTransaction = async (queries: TransactionQuery[]) => {
//   // DB接続
//   const dbJson = await gerPostgreDbClient();
//   const client = new Client(dbJson);
//   await client.connect();

//   // SQL中の?をpostgre用の$1,$2,$3,,,に置き換え
//   const replacedQueries = queries;
//   for (let i = 0; i < replacedQueries.length; i++) {
//     for (let num = 1; num <= 50; num++) {
//       if (replacedQueries[i].query.includes('?')) {
//         replacedQueries[i].query = replacedQueries[i].query.replace(
//           '?',
//           '$' + String(num),
//         );
//       } else {
//         break;
//       }
//     }
//   }
//   const queryObj = [];
//   for (let i = 0; i < replacedQueries.length; i++) {
//     queryObj.push({
//       text: replacedQueries[i].query,
//       values: replacedQueries[i].value,
//     });
//   }

//   const result = [];
//   try {
//     // トランザクション開始
//     await client.query('BEGIN');
//     // クエリ実行
//     for (let i = 0; i < queryObj.length; i++) {
//       const { text, values } = queryObj[i];
//       const result_i = await client.query(text, values);
//       result.push(result_i);
//     }
//     // コミット
//     await client.query('COMMIT');
//     // 接続終了
//     await client.end();
//     return result;
//   } catch (error) {
//     // ロールバック
//     await client.query('ROLLBACK');
//     // 接続終了
//     await client.end();
//     throw error;
//   }
// };
