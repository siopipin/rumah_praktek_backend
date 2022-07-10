const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, process.env.NODE_ENV + ".env"),
});

console.log(process.env.NODE_ENV + ".env");

const config = {
  //Server Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "127.0.0.1",
  PORT: process.env.PORT || 3001,

  //DB Configuration
  db: {
    host: process.env.DBHOST || "127.0.0.1",
    user: process.env.DBUSER || "root",
    password: process.env.DBPASSWORD || "root",
    database: process.env.DATABASE || "db_rumahpraktek",
  },
};

module.exports = config;
