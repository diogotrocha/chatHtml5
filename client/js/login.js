(function () {
    var loginBox = document.getElementById('login-box');
    var nickname = document.getElementById('nickname');
    var chatHeader = document.getElementById('chat-header');
    var chatArea = document.getElementById('chat-area');
    var usersActive = chatArea.querySelector('#users-active');
    var messagesArea = chatArea.querySelector('#messages-area');
    var userMessage = chatArea.querySelector('#user-message');

    var communication;
    var storage = new Storage();

    document.getElementById('login-form').addEventListener('submit', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // add animation to make element disappear
        loginBox.style.display = 'none';

        // add animations to make elements appear
        chatHeader.style.display = 'block';
        chatArea.style.display = 'block';

        communication = new Communication(nickname.value, new UiHandling(), storage);
    });

    document.getElementById('btn-logout').addEventListener('click', function () {
        communication.close();
        nickname.value = '';
        loginBox.style.display = 'block';
        chatHeader.style.display = 'none';
        chatArea.style.display = 'none';

        var nChildren = usersActive.children.length;
        for (var i = 0; i < nChildren; ++i) {
            usersActive.removeChild(usersActive.children[0]);
        }

        nChildren = messagesArea.children.length;
        for (i = 0; i < nChildren; ++i) {
            messagesArea.removeChild(messagesArea.children[0]);
        }

        userMessage.value = '';
    });
})();
