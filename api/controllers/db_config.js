// DB CONFIG DIGUNAKAN UNTUK ANTRIAN UNTUK SQL TRANSACTION

const mysql = require("mysql2/promise");
const config = require("../../config");

console.log("Setup connection conn...");
const pool = mysql.createPool(config.db);
module.exports = pool;
