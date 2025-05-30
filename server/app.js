// HTTP --》 WEBSOCKET

// RFC 规范
// - http握手
// - websocket数据传输

const http = require("http");

const FUNCTIONS = require("./custom_lib/websocket_methods");

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("hello world");
});
server.listen(3000, () => {
  console.log("the server is running on 3000");
});
