var express = require('express');
var router = express.Router();

var request = require('request');
var crypto = require('crypto');

// TODO: Change how config is read in.
var config = require('../config/config.json');
var auth = require('../config/auth.json');
var oauth = require('../oauth.js');
var chat = require('../chat.js');

// var irc = require('irc'); // TODO: Temp. Move logic to chat.js.
var tmi = require('tmi.js');
var client = undefined; // TEMP

router.get('/', function(req, res, next) {
    // TODO: Set up seperate code for dev and prd environments.
    var oauthParams = {
        'client_id': auth.client_id,
        'redirect_uri': 'http://localhost:3000' + '/streamkit/dashboard',
        'response_type': "code",
        'scope': config.scope,
        'force_verify': true,
        'state': generateToken()
    };
    var oauthUrl = 'https://api.twitch.tv/kraken/oauth2/authorize'
            + getQueryString(oauthParams);

    res.render('streamkit', {title: 'Streamkit', 'oauth_url': oauthUrl});
});


router.get("/dashboard", function(req, res, next) {
    // Make request for user token.
    oauth.getToken(req.query.code, req.query.state, function(body) {
        console.log(body);
        body = JSON.parse(body); // TODO: Handle this in getToken fuction?

        // TEMP for testing.
        var options = {
            'options': {
                'clientId': auth.client_id,
                'debug': true
            },
            'identity': {
                'username': 'damouryouknow',
                'password': 'oauth:' + body.access_token
            },
            'connection': {
                'reconnect': true
            },
            'channels': ['#damouryouknow']
        };
        client = new tmi.client(options);
        client.on('chat', function(channel, userstate, message, self) {
            console.log(message);
        });
        client.connect();
        /*
        // TODO: Send pongs every 5 minutes?
        if (client != undefined) {
            return;
        }
        var options = {
            'channels': ['#damouryouknow'],
            'server': 'irc.twitch.tv',
            'username': 'damouryouknow',
            'nick': 'damouryouknow',
            'password': 'oauth:' + body.access_token,
            'sasl': true
        };
        console.log(options);
        client = new irc.Client('irc.twitch.tv', 'damouryouknow', options);
        client.addListener('message', function(from, message) {
            console.log("FROM " + from + ": " + message);
        });
        client.addListener('error', function(message) {
            console.log("ERROR: " + message);
        });
        */
    });
});


/**
 * Converts an object to a query string.
 * @param {Object} obj - Object to turn into a query string.
 * @returns {string} URL query string from Object.
 */
function getQueryString(obj) {
    var queryStr = "";

    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (queryStr == "") {
                queryStr = "?" + property + "=" + obj[property];
            }
            else {
                queryStr += "&" + property + "=" + obj[property];
            }
        }
    }

    return queryStr;
}


/**
 * Generates a random token.
 * @returns {string} Random token.
 */
function generateToken() {
    return crypto.randomBytes(10).toString('hex');
}

module.exports = router;
