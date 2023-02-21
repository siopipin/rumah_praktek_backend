const mysql = require("mysql2/promise");
const config = require("../../config");

let globalPool = undefined;
async function query(sql, params) {
  const conn = await connect();
  const [result] = await conn.execute(sql, params);

  return result;
}

async function connect() {
  if (globalPool) {
    return globalPool;
  }
  globalPool = mysql.createPool(config.db);

  return globalPool;
}

module.exports = { query };
