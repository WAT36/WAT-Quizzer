const dotenv = require("dotenv");
const path = require('path');
const mysql = require('mysql2');

const env = dotenv.config({path: path.join(__dirname, "../../config/.env")})


// DB接続情報
let connection = mysql.createConnection({ 
	host : process.env.DB_HOSTNAME, 
	user : process.env.DB_USERNAME, 
	password : process.env.DB_PASSWORD, 
	port : process.env.DB_PORT, 
	database: process.env.DB_DBNAME
});

// DB接続
connection.connect();

// 試しに何か投げる
connection.query('SELECT * FROM quiz_file;', (err, rows) => {
    if (err){
        console.error(err);
    };

    console.log("Rows:",rows);
})

// 接続終了
connection.end();
