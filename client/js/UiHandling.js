function UiHandling() {

    function addUserToPanelAux(userNickname) {
        var user = document.createElement('div');
        user.setAttribute('class', 'user');
        user.setAttribute('data-user', userNickname);
        user.innerText = userNickname;
        document.getElementById('users-active').appendChild(user);
    }

    return {
        addNicknameToTitle: function (nickname) {
            var userNickname = document.getElementById('user-nickname');
            userNickname.innerText = nickname;
        },

        writeServerMessage: function (dateTimeStr, msgText) {
            var dateTime = document.createElement('span');
            dateTime.setAttribute('class', 'datetime');
            dateTime.innerText = dateTimeStr;

            var text = document.createElement('span');
            text.setAttribute('class', 'text');
            text.innerText = msgText;

            var serverMessage = document.createElement('article');
            serverMessage.setAttribute('class', 'server-message');
            serverMessage.appendChild(dateTime);
            serverMessage.appendChild(text);

            document.getElementById('messages-area').appendChild(serverMessage);
        },

        getUserMessage: function () {
            return document.getElementById('user-message').value;
        },

        clearUserMessage: function () {
            document.getElementById('user-message').value = '';
        },

        writeUserMessage: function (dateTimeStr, userNickname, msgText) {
            var dateTime = document.createElement('span');
            dateTime.setAttribute('class', 'datetime');
            dateTime.innerText = dateTimeStr;

            var user = document.createElement('span');
            user.setAttribute('class', 'user');
            user.innerText = userNickname + ':';

            var dateTimeUser = document.createElement('div');
            dateTimeUser.setAttribute('class', 'datetime-user');
            dateTimeUser.appendChild(dateTime);
            dateTimeUser.appendChild(user);

            var text = document.createElement('div');
            text.setAttribute('class', 'text');
            text.innerText = msgText;

            var clear = document.createElement('div');
            clear.style.clear = 'left';

            var message = document.createElement('article');
            message.setAttribute('class', 'message');
            message.appendChild(dateTimeUser);
            message.appendChild(text);
            message.appendChild(clear);

            document.getElementById('messages-area').appendChild(message);
        },

        addUserToPanel: function (userNickname) {
            addUserToPanelAux(userNickname);
        },

        removeUserFromPanel: function (userNickname) {
            var userElem = document.querySelector('.user[data-user="' + userNickname + '"]');
            userElem.parentNode.removeChild(userElem);
        },

        addAllUsersToPanel: function (nicknames) {
            nicknames.forEach(function (nickname) {
                addUserToPanelAux(nickname);
            });
        }
    }
}
