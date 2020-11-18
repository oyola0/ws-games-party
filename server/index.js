const WebSocketServer = require("websocket").server;
const express = require("express");
const path = require("path");

const engine = require("./engine/index");

const app = express();
const port = 8000;

const server = app.listen(port, () => {
  console.log("\x1b[36m", `http://localhost:${port}\n`, "\x1b[0m");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

const publicFolder = path.resolve(__dirname, "../public");
app.use(express.static(publicFolder));

const getMessage = (message) => {
  let data = message;

  if (message.type === "utf8") {
    data = message.utf8Data;
  } else if (message.type === "binary") {
    data = message.binaryData;
  }

  return JSON.parse(data);
};

wsServer.on("request", function (request) {
  const con = request.accept("echo-protocol", request.origin);

  con.send = (data) => {
    console.log("\x1b[33mResponse:\x1b[0m ", data);
    con.sendUTF(JSON.stringify(data));
  };

  con.on("message", function (message) {
    const data = getMessage(message);
    console.log("\x1b[33mRequest:\x1b[0m ", data);
    const msg = data.message;

    try {
      engine[msg](data, con);
    } catch (error) {
      console.log("\x1b[31mError:\x1b[0m", error);
      con.send({
        message: "error",
        msg: error.message,
      });
    }
  });

  con.on("close", function () {
    engine.disconnected(con);
    con.close();
  });
});
