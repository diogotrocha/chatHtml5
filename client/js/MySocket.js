/*
 * MySocket Class
 */

function MySocket(host, port, receiveHandler, errorHandler, handShakeHandler) {
    var socket = new WebSocket('ws://' + host + ':' + port);

    // When the connection is open, send some data to the server
    socket.onopen = function () {
        console.log('Client has connected to the server!');
        handShakeHandler();
        console.log('Handshake started!');
    };

    // Log errors
    socket.onerror = function (error) {
        console.log('WebSocket Error ' + error);
        errorHandler();
    };

    // Log messages from the server
    socket.onmessage = function (e) {
        console.log('Received a message from the server!', e.data);
        receiveHandler(e.data);
    };

    socket.onclose = function (e) {
        console.log('Socket closed. Code: ' + e.code);
    }

    return {
        sendMessage: function (msg) {
            console.log('Message to send: ' + msg);
            socket.send(JSON.stringify(msg));
        },
        close: function () {
            console.log('Close socket');
            socket.close();
        }
    }
}
