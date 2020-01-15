const dotEnv = require('dotenv');
const dotenvExpand = require('dotenv-expand')

const appEnv=dotEnv.config();
dotenvExpand(appEnv);

module.exports = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
}

