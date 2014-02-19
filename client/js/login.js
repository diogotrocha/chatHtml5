(function () {
    var loginBox = document.getElementById('login-box');
    var nickname = document.getElementById('nickname');
    var chatHeader = document.getElementById('chat-header');
    var chatArea = document.getElementById('chat-area');
    var userMessage = chatArea.querySelector('#user-message');

    var communication;
    var storage = new Storage();
    var uiHandling = new UiHandling();

    document.getElementById('login-form').addEventListener('submit', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // add animation to make element disappear
        loginBox.style.display = 'none';

        // add animations to make elements appear
        chatHeader.style.display = 'block';
        chatArea.style.display = 'block';

        communication = new Communication(nickname.value, uiHandling, storage);
    });

    document.getElementById('btn-logout').addEventListener('click', function () {
        communication.close();
        nickname.value = '';
        loginBox.style.display = 'block';
        chatHeader.style.display = 'none';
        chatArea.style.display = 'none';

        uiHandling.clearUsers();
        uiHandling.clearMessages();
        userMessage.value = '';
    });
})();
