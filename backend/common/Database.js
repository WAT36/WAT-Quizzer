const dotenv = require("dotenv");
const path = require('path');
const mysql = require('mysql2');

const env = dotenv.config({path: path.join(__dirname, "../../config/.env")})

// DB接続子を返す
const dbinfo = { 
    host : process.env.DB_HOSTNAME, 
    user : process.env.DB_USERNAME, 
    password : process.env.DB_PASSWORD, 
    port : process.env.DB_PORT, 
    database: process.env.DB_DBNAME
};

// SQLを実行する
const execQuery = async (query, value) => {
    try{
        // DB接続
        const connection = mysql.createConnection(dbinfo);

        // クエリ実行
        const result = await new Promise((resolve,reject) => {
            connection.query(query, value, (error, result) => {
                if(error){
                    reject(error);
                }
                resolve(result);
            })    
        })

        // 接続終了
        await connection.end();
        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    execQuery,
};
