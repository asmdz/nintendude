var express = require('express');
var router = express.Router();
var app = require('../app.js');

var request = require('request');
var crypto = require('crypto');

// TODO: Change how config is read in.
var config = require('../config/config.json');
var auth = require('../config/auth.json');
var oauth = require('../twitchApi/oauth.js');
var chatMonitor = require('../chatMonitor.js');

chatMonitor.startClient();

router.get('/', function(req, res, next) {
    var redirect = '';
    if (req.app.get('env') == 'development') {
        redirect = config.redirect_uri.dev;
    } else {
        redirect = config.redirect_uri.prd;
    }

    var oauthParams = {
        client_id: auth.client_id,
        redirect_uri: redirect,
        response_type: 'code',
        scope: config.scope,
        force_verify: true,
        state: generateToken()
    };
    var oauthUrl = 'https://api.twitch.tv/kraken/oauth2/authorize'
            + getQueryString(oauthParams);

    res.render('streamkit', {title: 'Streamkit', oauth_url: oauthUrl});
});


router.get('/dashboard', function(req, response, next) {
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

        body = JSON.parse(body); // TODO: Handle this in getToken fuction?

        oauth.validate(body.access_token, function(err, res, body) {
            if (err) {
                return next(err);
            }
            if (res.statusCode != 200) {
                err = new Error();
                err.status = res.statusCode;
                return next(err);
            }

            body = JSON.parse(body);
            chatMonitor.addUser(body.token.user_name);

            response.render('index', {title: 'Success'});
        });
    });
});


/**
 * Converts an object to a query string.
 * @param {Object} obj - Object to turn into a query string.
 * @returns {string} URL query string from Object.
 */
function getQueryString(obj) {
    var queryStr = '';

    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (queryStr == '') {
                queryStr = '?' + property + '=' + obj[property];
            }
            else {
                queryStr += '&' + property + '=' + obj[property];
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
