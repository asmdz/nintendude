var request = require('request');

var config = require('./config/config.json');
var auth = require('./config/auth.json');


/**
 * Sends a post request to get a access token from Twitch.
 * @param {string} code - Authorization code used to get the token.
 * @param {string} state - State used to get the token.
 * @param {function(object, object)} - Response callback.
 */
module.exports.getToken = function(code, state, callback) {
    var reqUrl = 'https://api.twitch.tv/kraken/oauth2/token';
    var params = {
        'client_id': auth.client_id,
        'client_secret': auth.secret,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': 'http://localhost:3000' + '/streamkit/dashboard',
        'state': state
    };

    request({
        'url': reqUrl,
        'method': 'POST',
        'headers': {'content-type': 'application/x-www-form-urlencoded'},
        'form': params
    },
    function (err, res, body) {
        callback(body, err);
    });
}

/*
 *
 */
module.exports.validate = function(token, callback) {
     var reqUrl = 'https://api.twitch.tv/kraken';

     request({
         'url': reqUrl,
         'method': 'GET',
         'headers': {'Authorization': 'OAuth ' + token}
     },
     function(err, res, body) {
         callback(body, err);
     });
}
