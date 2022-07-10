const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const config = require("./config");

server.listen(config.PORT, config.HOST, function () {
  console.log(`${__dirname}`);
  console.log(`App listening on ${config.HOST}:${config.PORT}`);
  console.log(`NODE_ENV=${config.NODE_ENV}`);
});
