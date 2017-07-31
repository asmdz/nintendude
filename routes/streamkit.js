var express = require('express');
var router = express.Router();

var request = require('request');
var crypto = require('crypto');

// TODO: Change how config is read in.
var config = require('../config/config.json');
var auth = require('../config/auth.json');
var oauth = require('../twitchApi/oauth.js');
var chatMonitor = require('../chatMonitor.js');


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

    res.render('streamkit', {'title': 'Streamkit', 'oauth_url': oauthUrl});
});


router.get("/dashboard", function(req, response, next) {
    // TODO: Get some proper error handling done.
    // Make request for user token.
    oauth.getToken(req.query.code, req.query.state, function(err, res, body) {
        if (err) {
            return next(err);
        }
        if (res.statusCode != 200) {
            err = new Error();
            err.status = res.statusCode;
            return next(err);
        }

        console.log('1: ' + body);
        body = JSON.parse(body); // TODO: Handle this in getToken fuction?
        var token = body.access_token;

        oauth.validate(body.access_token, function(err, res, body) {
            if (err) {
                return next(err);
            }
            if (res.statusCode != 200) {
                err = new Error();
                err.status = res.statusCode;
                return next(err);
            }

            console.log('2 ' + body);
            body = JSON.parse(body);
            //console.log(body);
            var username = body.token.user_name;

            console.log(username + ", " + token);
            chatMonitor.addClient(username, token);

            response.render('index', {title: 'Succ'});
        });
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
