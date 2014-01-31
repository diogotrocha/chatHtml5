function MySocket(host, port, receiveHandler) {
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
}


