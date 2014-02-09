var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});

console.log('Server Started');

var clients = [];

wss.on('connection', function(ws) {
    console.log('New connection from a client');

    var clientId = ws['_socket']['_handle']['fd'];
    clients[clientId] = ws;
    console.log('Add new client to client list with id ' + clientId);

    // message from client listener
    ws.on('message', function(message) {
        console.log('received: %s', message);

        var sendedClients = [];
        var errorClients = [];

        clients.forEach(function(client) {
            try {
                client.send(message);
                sendedClients.push(client);
            }
            catch (e) {
                // not possible to send message to client
                errorClients.push(client);
            }
        });

        clients = sendedClients;
    });

    // client disconnected
    ws.on('close', function() {
        console.log('disconnected client ' + this['_socket']['_handle']['fd']);
        delete clients[this['_socket']['_handle']['fd']];
        console.log('removed client ' + this['_socket']['_handle']['fd'] + ' from clients list');
    })
});
