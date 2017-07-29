var express = require('express');
var router = express.Router();

var request = require('request');
var crypto = require('crypto');

// TODO: Change how config is read in.
var config = require('../config/config.json');
var auth = require('../config/auth.json');
var oauth = require('../oauth.js');

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
