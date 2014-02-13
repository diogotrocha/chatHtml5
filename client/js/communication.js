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

    function writeMessage(msgText) {
        var message = document.createElement('div');
        message.setAttribute('class', 'message');
        message.innerText = msgText;
        document.getElementById('messages-area').appendChild(message);
    }

    function addUserToPanel(userNickname) {
        var user = document.createElement('div');
        user.setAttribute('class', 'user');
        user.setAttribute('data-user', userNickname);
        user.innerText = userNickname;
        document.getElementById('users-active').appendChild(user);
    }

    function removeUserFromPanel(userNickname) {
        var userElem = document.querySelector('.user[data-user="' + userNickname + '"]');
        userElem.parentNode.removeChild(userElem);
    }

    function addAllUsersToPanel(nicknames) {
        nicknames.forEach(function (nickname) {
            addUserToPanel(nickname);
        });
    }

    function receiveHandler(msg) {
        msg = JSON.parse(msg);

        try {
            if (msg.nicknames !== null && msg.nicknames !== undefined) {
                console.log('Handshake accepted!');
                handShakeSuccess = true;
                addAllUsersToPanel(msg.nicknames);
            } else if (msg.new_user !== null && msg.new_user !== undefined) {
                addUserToPanel(msg.new_user);
                writeMessage(msg.message);
            } else if (msg.removed_user !== null && msg.removed_user !== undefined) {
                removeUserFromPanel(msg.removed_user);
                writeMessage(msg.message);
            } else if (msg.user !== null && msg.user !== undefined) {
                writeMessage(msg.message);
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
            var message = document.querySelector('textarea[name="user-message"]').value;
            console.log();
            mySocket.sendMessage({message: message});
        } else {
            alert('hand shake error');
        }
    }
}
