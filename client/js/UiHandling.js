/*
 * UiHandling class
 *
 * Has static methods for updating the UI content
 */
function UiHandling() {

    var addNicknameToTitle = function (nickname) {
        var userNickname = document.getElementById('user-nickname');
        console.log(nickname);
        console.log(userNickname);
        userNickname.innerHTML = nickname;
    };

    var getUserMessage = function () {
        return document.getElementById('user-message').value;
    };

    var clearUserMessage = function () {
        document.getElementById('user-message').value = '';
    };

    var appendMessage = function (messageNode) {
        var messagesArea = document.getElementById('messages-area');
        messagesArea.appendChild(messageNode);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    var writeServerMessage = function (dateTimeStr, msgText) {
        var dateTime = document.createElement('span');
        dateTime.setAttribute('class', 'datetime');
        dateTime.innerHTML = dateTimeStr;

        var text = document.createElement('span');
        text.setAttribute('class', 'text');
        text.innerHTML = msgText;

        var serverMessage = document.createElement('article');
        serverMessage.setAttribute('class', 'server-message');
        serverMessage.appendChild(dateTime);
        serverMessage.appendChild(text);

        appendMessage(serverMessage);
    };

    var writeUserMessage = function (dateTimeStr, userNickname, msgText) {
        var dateTime = document.createElement('span');
        dateTime.setAttribute('class', 'datetime');
        dateTime.innerHTML = dateTimeStr;

        var user = document.createElement('span');
        user.setAttribute('class', 'user');
        user.innerHTML = userNickname + ':';

        var dateTimeUser = document.createElement('div');
        dateTimeUser.setAttribute('class', 'datetime-user');
        dateTimeUser.appendChild(dateTime);
        dateTimeUser.appendChild(user);

        var text = document.createElement('div');
        text.setAttribute('class', 'text');
        text.innerHTML = msgText;

        var clear = document.createElement('div');
        clear.style.clear = 'left';

        var message = document.createElement('article');
        message.setAttribute('class', 'message');
        message.appendChild(dateTimeUser);
        message.appendChild(text);
        message.appendChild(clear);

        appendMessage(message);
    };

    var addUserToPanel = function (userNickname) {
        var user = document.createElement('li');
        user.setAttribute('class', 'user');
        user.setAttribute('data-user', userNickname);
        user.innerHTML = userNickname;
        document.getElementById('users-active').appendChild(user);
    };

    var removeUserFromPanel = function (userNickname) {
        var userElem = document.querySelector('.user[data-user="' + userNickname + '"]');
        userElem.parentNode.removeChild(userElem);
    };

    var addAllUsersToPanel = function (nicknames) {
        nicknames.forEach(function (nickname) {
            addUserToPanel(nickname);
        });
    };

    var loadSavedMessages = function (messages) {
        if (messages !== null && messages !== undefined) {
            messages.forEach(function (msg) {
                if (msg.new_user !== null && msg.new_user !== undefined) {
                    writeServerMessage(msg.datetime, msg.message);
                } else if (msg.removed_user !== null && msg.removed_user !== undefined) {
                    writeServerMessage(msg.datetime, msg.message);
                } else if (msg.user !== null && msg.user !== undefined) {
                    writeUserMessage(msg.datetime, msg.user, msg.message);
                }
            });
        }
    };

    var clearUsers = function () {
        var usersActive = document.getElementById('users-active');
        var nChildren = usersActive.children.length;
        for (var i = 0; i < nChildren; ++i) {
            usersActive.removeChild(usersActive.children[0]);
        }
    };

    var clearMessages = function () {
        var messagesArea = document.getElementById('messages-area');
        var nChildren = messagesArea.children.length;
        for (var i = 0; i < nChildren; ++i) {
            messagesArea.removeChild(messagesArea.children[0]);
        }
    };

    return {
        addNicknameToTitle: addNicknameToTitle,
        writeServerMessage: writeServerMessage,
        getUserMessage: getUserMessage,
        clearUserMessage: clearUserMessage,
        writeUserMessage: writeUserMessage,
        addUserToPanel: addUserToPanel,
        removeUserFromPanel: removeUserFromPanel,
        addAllUsersToPanel: addAllUsersToPanel,
        loadSavedMessages: loadSavedMessages,
        clearUsers: clearUsers,
        clearMessages: clearMessages
    }
}
