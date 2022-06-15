const dotenv = require("dotenv");
const path = require('path');
const mysql = require('mysql2');

const env = dotenv.config({path: path.join(__dirname, "../../config/.env")})

// DB接続子を返す
const getConnection = function(){
    // DB接続情報
    return mysql.createConnection({ 
        host : process.env.DB_HOSTNAME, 
        user : process.env.DB_USERNAME, 
        password : process.env.DB_PASSWORD, 
        port : process.env.DB_PORT, 
        database: process.env.DB_DBNAME
    });
}
exports.getConnection = getConnection;

