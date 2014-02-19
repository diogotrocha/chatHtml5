/*
 * Communication class
 *
 * Establishes the communication protocol with the server
 */

function Communication(nickname, uiHandling, storage) {
    var handShakeSuccess = false;
    var mySocket;

    if (!nickname) {
        alert('nickname not defined!');
    } else {
        // create socket connection
        mySocket = new MySocket('localhost', '8080', receiveHandler, errorHandler, handShakeHandler);

        // register handler to send message
        document.getElementById('send').addEventListener('click', sendMessageHandler);

        // register handler to clear chat
        document.getElementById('clear').addEventListener('click', clearMessagesHandler);

        // add nickname to title
        uiHandling.addNicknameToTitle(nickname);

        uiHandling.loadSavedMessages(storage.getMessages(nickname));
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
            storage.setUser(nickname);
        } else if (msg.new_user !== null && msg.new_user !== undefined) {
            uiHandling.addUserToPanel(msg.new_user);
            uiHandling.writeServerMessage(msg.datetime, msg.message);
            storage.setMessage(nickname, msg);
        } else if (msg.removed_user !== null && msg.removed_user !== undefined) {
            uiHandling.removeUserFromPanel(msg.removed_user);
            uiHandling.writeServerMessage(msg.datetime, msg.message);
            storage.setMessage(nickname, msg);
        } else if (msg.user !== null && msg.user !== undefined) {
            uiHandling.writeUserMessage(msg.datetime, msg.user, msg.message);
            storage.setMessage(nickname, msg);
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
            mySocket.sendMessage({message: uiHandling.getUserMessage()});
            uiHandling.clearUserMessage()
        } else {
            alert('hand shake error');
        }
    }

    function clearMessagesHandler() {
        uiHandling.clearMessages();
        storage.clear(nickname);
    }

    return {
        close: function () {
            mySocket.sendMessage({close: nickname});
            mySocket.close();
            document.getElementById('send').removeEventListener('click', sendMessageHandler);
        }
    }
}
