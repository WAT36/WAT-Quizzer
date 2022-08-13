var log4js = require('log4js');

const env = dotenv.config({path: path.join(__dirname, "../../config/.env")})

log4js.configure({
    appenders: {
        backend:{
            type: "file",
            category: "backend",
            filename: process.env.BACKEND_LOG_FILE,
            pattern: "-yyyy-MM-dd"
        }
    }
});

// バックエンド用ロガー取得
export const getBackendLogger = () => {
    return log4js.getLogger('backend');
}