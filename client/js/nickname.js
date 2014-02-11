function getNickname() {
    function parseQueryString() {
        var assoc = {};
        var keyValues = location.search.slice(1).split('&');
        var decode = function(s){
            return decodeURIComponent(s.replace(/\+/g, ' '));
        };

        for (var i = 0; i < keyValues.length; ++i) {
            var key = keyValues[i].split('=');
            if (1 < key.length) {
                assoc[decode(key[0])] = decode(key[1]);
            }
        }

        return assoc;
    }

    var queryString = parseQueryString();

    if (queryString['nickname'] === null || queryString['nickname'] === undefined) {
        return false;
    }

    return queryString['nickname'];
}
