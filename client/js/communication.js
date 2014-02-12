/*
 * Communication class
 *
 * Establishes the communication protocol with the server
 */

function Communication(nickname) {
    var handShakeSuccess = false;
    var mySocket;

    if (!nickname) {
        alert('nickname not defined!');
    } else {
        mySocket = new MySocket('localhost', '8080', receiveHandler, errorHandler, handShakeHandler);
        document.getElementById('send').addEventListener('click', sendMessageHandler);
    }

    function receiveHandler(msg) {
        msg = JSON.parse(msg);

        try {
            if (msg.nicknames !== null && msg.nicknames !== undefined) {
                console.log('Handshake accepted!');
                handShakeSuccess = true;
                // add users to aside
            } else if (msg.new_user !== null && msg.new_user !== undefined) {
                // add user to aside
            } else if (msg.remove_user !== null && msg.remove_user !== undefined) {
                // remove user from aside
                // show message of user disconnected
            } else if (msg.user !== null && msg.user !== undefined) {
                var message = document.createElement('div');
                message.setAttribute('id', 'message');
                message.innerText = msg['message'];
                document.getElementById('messages-area').appendChild(message);
            } else {
                console.log('Message with error:');
                console.log(msg);
            }
        } catch (e) {
            console.error("Parsing json:", e);
        }
    }

    function errorHandler() {
        alert('error connecting to server!');
    }

    function handShakeHandler() {
        mySocket.sendMessage({nickname: nickname});
    }

    function sendMessageHandler() {
        if (handShakeSuccess) {
            console.log(document.querySelector('textarea[name="user-message"]').value);
            mySocket.sendMessage({message: document.querySelector('textarea[name="user-message"]').value});
        } else {
            alert('hand shake error');
        }
    }
}
