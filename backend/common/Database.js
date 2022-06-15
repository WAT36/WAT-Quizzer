const dotenv = require("dotenv");
const path = require('path');

const env = dotenv.config({path: path.join(__dirname, "../../config/.env")})

console.log(process.env.DB_DBNAME);