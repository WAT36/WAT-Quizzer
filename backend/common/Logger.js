const log4js = require('log4js');
const dotenv = require('dotenv');
const path = require("path");

const env = dotenv.config({path: path.join(__dirname, "../../config/.env")})

log4js.configure({
    appenders: {
        backend:{
            type: "file",
            filename: process.env.BACKEND_LOG_FILE,
            pattern: "-yyyy-MM-dd"
        }
    },
    categories: {
        default: {
            appenders: ["backend"],
            level: "info",
        }
    }
});

// バックエンド用ロガー取得
const getBackendLogger = () => {
    return log4js.getLogger();
}

module.exports = {
    getBackendLogger
}