(function () {
    //document.getElementById('submit-login').addEventListener('click', function (e) {
    document.getElementById('login-form').addEventListener('submit', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // add animation to make element disappear
        document.getElementById('login-box').style.display = 'none';

        // add animations to make elements appear
        document.getElementById('chat-header').style.display = 'block';
        document.getElementById('chat-area').style.display = 'block';

        var communication = new Communication(document.getElementById('nickname').value, new UiHandling());
    });
})();
