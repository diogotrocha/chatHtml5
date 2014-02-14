/*
 * Communication class
 *
 * Establishes the communication protocol with the server
 */

function Communication(nickname, uiHandling) {
    var handShakeSuccess = false;
    var mySocket;

    if (!nickname) {
        alert('nickname not defined!');
    } else {
        // create socket connection
        mySocket = new MySocket('localhost', '8080', receiveHandler, errorHandler, handShakeHandler);

        // register handler to send message
        document.getElementById('send').addEventListener('click', sendMessageHandler);

        // add nickname to title
        var userNickname = document.getElementById('user-nickname');
        userNickname.innerText = userNickname.innerText + '' + nickname;
    }

    function receiveHandler(msg) {
        try {
            msg = JSON.parse(msg);
        } catch (e) {
            console.error("Parsing json:", e);
        }

        if (msg.nicknames !== null && msg.nicknames !== undefined) {
            console.log('Handshake accepted!');
            handShakeSuccess = true;
            uiHandling.addAllUsersToPanel(msg.nicknames);
        } else if (msg.new_user !== null && msg.new_user !== undefined) {
            uiHandling.addUserToPanel(msg.new_user);
            uiHandling.writeServerMessage(msg.message);
        } else if (msg.removed_user !== null && msg.removed_user !== undefined) {
            uiHandling.removeUserFromPanel(msg.removed_user);
            uiHandling.writeServerMessage(msg.message);
        } else if (msg.user !== null && msg.user !== undefined) {
            uiHandling.writeUserMessage(msg.datetime, msg.user, msg.message);
        } else {
            console.log('Message with error:');
            console.log(msg);
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
            var userMessage = document.querySelector('textarea[name="user-message"]');
            mySocket.sendMessage({message: userMessage.value});
            userMessage.value = '';
        } else {
            alert('hand shake error');
        }
    }
}
