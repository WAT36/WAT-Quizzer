var log4js = require('log4js');

const env = dotenv.config({path: path.join(__dirname, "../../config/.env")})

var logger = exports = module.exports = {};
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

logger.request = log4js.getLogger('request');