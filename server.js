const app = require("./app");
const debug = require("debug");
const https = require("https");
const fs = require("fs");
const chance = require("chance").Chance();

process.env.JWT_KEY = chance.string({ length: 64 });
console.log(`JWT KEY: ${process.env.JWT_KEY}`);

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

var options = {
  key: fs.readFileSync("/home/admmsk/cert/privkey.pem"),
  cert: fs.readFileSync("/home/admmsk/cert/cert.pem"),
};

const server = https.createServer(options, app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
console.log("Server started on port: " + port);
