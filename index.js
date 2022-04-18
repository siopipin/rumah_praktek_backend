const http = require("http");
const app = require("./app");
const server = http.createServer(app);

process.env.JWT_KEY = "rumah_praktek_app_auth";
server.listen(3001, () => {
  console.log(`${__dirname}:${3001}`);
});
