const WebSocketServer = require('websocket').server;
const express = require('express');
const path = require('path');

const engine = require('./engine/index');

const app = express();
const port = 8000;

const server = app.listen(port, () => {
    console.log(`\nhttp://localhost:${port}\n`);
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

const publicFolder = path.resolve(__dirname, '../public');
app.use(express.static(publicFolder));

const getMessage = (message) => {
    let data = message;

    if (message.type === 'utf8') {
        data = message.utf8Data;
    } else if (message.type === 'binary') {
        data = message.binaryData;
    }

    return JSON.parse(data);
};

wsServer.on('request', function (request) {   
    const con = request.accept('echo-protocol', request.origin);

    con.send = (data) => {
        console.log('Response: ', data);
        con.sendUTF(JSON.stringify(data));
    };

    con.on('message', function (message) {
        const data = getMessage(message);
        console.log('Request: ', data);
        const msg = data.message;
        
        if(msg && engine[msg]) {
            engine[msg](data, con);            
        }  
    });

    con.on('close', function () {
        con.close();
        // console.log('Connection closed =>', connection);
    });
});