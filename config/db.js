const mysql = require("mysql2/promise");
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "restaurant_db",
    port: process.env.DB_PORT,
    multipleStatements: true,
});

module.exports = { pool };