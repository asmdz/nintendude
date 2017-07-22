var express = require('express');
var router = express.Router();
// TODO: Change how config is read in.
var config = require('../config/config.json');
var auth = require('../config/auth.json');

router.get('/', function(req, res, next) {
    // Check if request is from redirect uri of user.
    console.log(req.query);
    if (req.query.hasOwnProperty('code')) {

        res.render('streamkit', {title: 'Success', 'oauth_url': oauthUrl});
        return;
    }

    // TODO: Set up seperate code for dev and prd environments.
    var oauthParams = {
        'client_id': auth.client_id,
        'redirect_uri': "http://localhost:3000" + config.redirect_uri,
        'response_type': "code",
        'scope': config.scope,
        'force_verify': true
    };
    var oauthUrl = 'https://api.twitch.tv/kraken/oauth2/authorize'
            + getQueryString(oauthParams);

    res.render('streamkit', {title: 'Streamkit', 'oauth_url': oauthUrl});
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

module.exports = router;
