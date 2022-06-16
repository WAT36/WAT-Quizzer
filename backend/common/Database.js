const dotenv = require("dotenv");
const path = require('path');
const mysql = require('mysql2');

const env = dotenv.config({path: path.join(__dirname, "../../config/.env")})

// DB接続子を返す
const pool = mysql.createPool({ 
        host : process.env.DB_HOSTNAME, 
        user : process.env.DB_USERNAME, 
        password : process.env.DB_PASSWORD, 
        port : process.env.DB_PORT, 
        database: process.env.DB_DBNAME
});

// SQLを実行する
const execQuery = async (query) => {
    try{
        // DB接続
        const connection = await new Promise((resolve,reject) => {
            pool.getConnection((error, connection) => {
                if(error){
                    reject(error);
                }
                resolve(connection);
            })
        })

        // クエリ実行
        const result = await new Promise((resolve,reject) => {
            connection.query(query, (error, result) => {
                if(error){
                    reject(error);
                }
                resolve(result);
            })    
        })

        // 接続終了
        await connection.release();
        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    execQuery,
};
