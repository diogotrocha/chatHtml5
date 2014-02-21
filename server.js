/*
 * NodeJS WebSocket server
 *
 * Uses module "ws"
 */

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});

console.log('Server Started');

var clients = [];

function getIdByClientId(clientId) {
    // Get array id of client that sent the message
    var i, nClients = clients.length;
    for (i = 0; i < nClients; ++i) {
        if (clients[i].clientId === clientId) {
            break;
        }
    }

    return i;
}

function getIdByNickname(nickname) {
    // Get array id of client that sent the message
    var i, nClients = clients.length;
    for (i = 0; i < nClients; ++i) {
        if (clients[i].nickname === nickname) {
            break;
        }
    }

    return i;
}

function getCurrentDateTime() {
    var date = new Date();
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        + ' ' + date.getHours() + ':' + date.getMinutes();
}

wss.on('connection', function(ws) {
    console.log('----------------------');
    console.log('New connection from a client');

    var clientId = ws['_socket']['_handle']['fd'];
    var id = getIdByClientId(clientId);

    if (id < clients.length) {
        disconnectUser(id);
    }

    clients.push({clientId: clientId, ws: ws});

    console.log('Added new client to client list with id ' + clientId);

    // message from client listener
    ws.on('message', function(message) {
        var clientId = ws['_socket']['_handle']['fd'];
        console.log('----------------------');
        console.log('received "%s" from client "%d"', message, clientId);

        var id = getIdByClientId(clientId);

        try {
            var msg = JSON.parse(message);

            // verify if is the message of a new client making handshake
            if (msg.nickname !== null && msg.nickname !== undefined) {
                clients[id]['nickname'] = msg.nickname;
                console.log('Received nickname "' + msg.nickname + '" of client' + clients[id].clientId);

                sendUsersToClient(clients[id]['ws']);

                // notify others users of existence of new user
                broadcast(
                    JSON.stringify({new_user: msg.nickname, message: "User " + msg.nickname + " joined the chat.", datetime: getCurrentDateTime()}),
                    msg.nickname
                );
            } else if (msg.close !== null && msg.close !== undefined) {
                disconnectUser(getIdByNickname(msg.close));
            } else {
                // broadcast message of user to all users
                broadcast(
                    JSON.stringify({user: clients[id].nickname, message: msg.message, datetime: getCurrentDateTime()})
                );
            }
        } catch (e) {
            console.error("Parsing json:", e);
        }
    });

    // client disconnected
    ws.on('close', function() {
        var socket = this['_socket'];

        if (socket['_handle'] === null || socket['_handle'] === undefined) {
            return;
        }

        disconnectUser(getIdByClientId(socket['_handle']['fd']));
    });

    // disconnect user by its id on array
    function disconnectUser(id) {
        console.log('----------------------');
        console.log('disconnected client ' + clientId);

        broadcast(
            JSON.stringify({
                    removed_user: clients[id].nickname,
                    message: "User " + clients[id].nickname + " left the chat.",
                    datetime: getCurrentDateTime()
                }
            )
        );

        clients.splice(id, 1);

        console.log('removed client ' + clientId + ' from clients list');
    }

    // send current users list to a client
    function sendUsersToClient(clientWs) {
        var nicknames = [];
        clients.forEach(function(client) {
            nicknames.push(client.nickname);
        });

        clientWs.send(JSON.stringify({nicknames: nicknames}));
    }

    // send message to all users of chat
    function broadcast(message, except) {
        var sentClients = [];
        var errorClients = [];

        clients.forEach(function(client) {
            try {
                if (client.nickname !== except) {
                    client.ws.send(message);
                }

                sentClients.push(client);
            }
            catch (e) {
                // not possible to send message to client
                errorClients.push(client);
            }
        });

        console.log('broadcast message "%s" sent', message);
    }
});
