/*function MySocket(host, port, receiveHandler) {
    this.socket = io.connect(host + ':' + port);

    // Add a connect listener
    this.socket.on('connect',function() {
        console.log('Client has connected to the server!');
    });

    // Add a receibe listener
    this.socket.on('message',function(msg) {
        console.log('Received a message from the server!', msg);
        receiveHandler(msg);
    });

    // Add a disconnect listener
    this.socket.on('disconnect',function() {
        console.log('The client has disconnected!');
    });
}

MySocket.prototype.sendMessage = function (msg) {
    this.socket.send(msg);
}*/


function MySocket(host, port, receiveHandler) {
    this.socket = new WebSocket('ws://' + host + ':' + port);

    // When the connection is open, send some data to the server
    this.socket.onopen = function () {
        console.log('Client has connected to the server!');
    };

    // Log errors
    this.socket.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    this.socket.onmessage = function (e) {
        console.log('Received a message from the server!', e.data);
        receiveHandler(e.data);
    };
}

MySocket.prototype.sendMessage = function (msg) {
    this.socket.send(msg);
}




