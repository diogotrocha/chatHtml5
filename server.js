var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});

console.log('Server Started');

var clients = [];

wss.on('connection', function(ws) {
    console.log('New connection from a client');

    var clientId = ws['_socket']['_handle']['fd'];
    clients.push({clientId: clientId, ws: ws});
    console.log('Added new client to client list with id ' + clientId);

    // message from client listener
    ws.on('message', function(message) {
        var clientId = ws['_socket']['_handle']['fd'];
        console.log('received "%s" from client "%d"', message, clientId);

        // Get array id of client that sent the message
        var i, nClients = clients.length;
        for (i = 0; i < nClients; ++i) {
            if (clients[i].clientId === clientId) {
                break;
            }
        }

        try {
            var msg = JSON.parse(message);

            // verify if is the message of a new client making handshake
            if (msg.nickname !== null && msg.nickname !== undefined) {
                clients[i]['nickname'] = msg.nickname;
                console.log('Received nickname "' + msg.nickname + '" of client' + clients[i].clientId);

                sendUsersToClient(clients[i]['ws']);

                // notify others users of existence of new user
                broadcast(
                    JSON.stringify({new_user: msg.nickname, message: "User " + msg.nickname + " joined the chat."}),
                    msg.nickname
                );
            } else {
                // broadcast message of user to all users
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

    function sendUsersToClient(clientWs) {
        var nicknames = [];
        clients.forEach(function(client) {
            nicknames.push(client.nickname);
        });

        clientWs.send(JSON.stringify({nicknames: nicknames}));
    }

    // send message to all users of chat
    function broadcast(message, except) {
        var sendedClients = [];
        var errorClients = [];

        clients.forEach(function(client) {
            try {
                if (client.nickname !== except) {
                    client.ws.send(message);
                }

                sendedClients.push(client);
            }
            catch (e) {
                // not possible to send message to client
                errorClients.push(client);
            }
        });
        clients = sendedClients;

        console.log('broadcast message sent');
    }
});
