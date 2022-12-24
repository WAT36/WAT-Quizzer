import log4js from 'log4js';
import dotenv from 'dotenv';
import path from "path";

const env = dotenv.config({path: path.join(__dirname, "../../../config/.env")})

log4js.configure({
    appenders: {
        backend:{
            type: "dateFile",
            filename: process.env.BACKEND_LOG_FILE,
            pattern: "-yyyy-MM-dd",
            numBackups: 5
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
export const getBackendLogger = () => {
    return log4js.getLogger();
}
