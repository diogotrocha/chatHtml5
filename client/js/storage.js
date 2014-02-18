function Storage() {
    var hasLocalStorage = false;

    try {
        localStorage.setItem('a', 'a');
        localStorage.removeItem('a');
        hasLocalStorage = true;
    } catch(e) {}

    return {
        setUser: function (nickname) {
            if (hasLocalStorage) {
                var nick = localStorage.getItem(nickname);
                if (nick === null || nick === undefined) {
                    localStorage.setItem(nickname, JSON.stringify([]));
                }
            }
        },
        setMessage: function (nickname, msg) {
            if (hasLocalStorage) {
                var messages = JSON.parse(localStorage.getItem(nickname));
                messages.push(msg);
                localStorage.setItem(nickname, JSON.stringify(messages));
            }
        },
        getMessages: function (nickname) {
            if (hasLocalStorage) {
                return JSON.parse(localStorage.getItem(nickname));
            }

            return [];
        },
        clear: function (nickname) {
            localStorage.removeItem(nickname);
        }
    }
}
