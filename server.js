var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});

console.log('Server Started');

wss.on('connection', function(ws) {
    console.log('New connection');

    // message from client listener
    ws.on('message', function(message) {
        console.log('received: %s', message);
        ws.send(message);
    });
});
