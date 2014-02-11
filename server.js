var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});

console.log('Server Started');

var clients = [];

wss.on('connection', function(ws) {
    console.log('New connection from a client');

    var clientId = ws['_socket']['_handle']['fd'];
    var nClients = clients.length;
    clients.push({clientId: clientId, ws: ws});
    console.log('Add new client to client list with id ' + clientId);

    // message from client listener
    ws.on('message', function(message) {
        var clientId = ws['_socket']['_handle']['fd'];

        var i;
        for (i = 0; i < clients.length; ++i) {
            if (clients[i].clientId === clientId) {
                break;
            }
        }

        console.log('received "%s" from client "%d"', message, clientId);

        try {
            console.log(message);
            var msg = JSON.parse(message);
            console.log(msg);
            if (msg.nickname !== null && msg.nickname !== undefined) {
                clients[i]['nickname'] = msg.nickname;

                console.log(msg.nickname);
                broadcast(JSON.stringify({new_user: msg.nickname, message: "User " + msg.nickname + " joined the chat."}));
            } else {
                broadcast(JSON.stringify({user: clients[i].nickname, message: message}));
            }
        } catch (e) {
            console.error("Parsing json:", e);
        }
    });

    // client disconnected
    ws.on('close', function() {
        var clientId = this['_socket']['_handle']['fd'];
        console.log('disconnected client ' + this['_socket']['_handle']['fd']);
        var msgJson = [];
        msgJson['removed_user'] = clients[clientId]['nickname'];
        msgJson['message'] = "User " + clients[clientId]['nickname'] + " left the chat.";
        broadcast(JSON.stringify(msgJson));
        delete clients[clientId];
        console.log('removed client ' + clientId + ' from clients list');
    });

    // send message to all users of chat
    function broadcast(message) {
        var sendedClients = [];
        var errorClients = [];

        console.log(message);

        clients.forEach(function(client) {
            console.log(client);
            try {
                client['ws'].send(message);
                sendedClients.push(client);
            }
            catch (e) {
                // not possible to send message to client
                errorClients.push(client);
            }
        });
        /*var nClients = clients.length;
        console.log(clients);
        console.log(nClients);
        for (var i = 0; i < nClients; ++i) {
            console.log(clients[i]);
            try {
                clients[i].ws.send(message);
                sendedClients.push(clients[i]);
            }
            catch (e) {
                // not possible to send message to client
                errorClients.push(clients[i]);
            }
        }*/
        clients = sendedClients;

        console.log('broadcast message sent');
    }
});
