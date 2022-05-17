require('dotenv').config();

const PORT = process.env.PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_URL = process.env.MONGODB_URI;

module.exports = {
    PORT,
    DB_PASSWORD,
    DB_NAME,
    DB_URL,
};