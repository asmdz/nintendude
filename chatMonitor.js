var tmi = require('tmi.js');

var config = require('./config/config.json');
var auth = require('./config/auth.json');

var users = {};

module.exports.addClient = function(username, token) {
    // Configure client.
    var clientConfig = {
        'options': {
            'clientId': auth.client_id,
            'debug': true
        },
        'identity': {
            'username': username,
            'password': 'oauth:' + token
        },
        'connection': {'reconnect': true},
        'channels': ['#' + username]
    };

    // Create client.
    var newClient = new tmi.client(clientConfig);

    // Add client to users.
    users[username] = {
        'client': newClient
    }

    // Add events to client.
    newClient.on('subscription', handleSubscription);

    // Connect client.
    newClient.connect();
}


function handleSubscription(channel, username, method, message, userstate) {
    console.log('Subscription event');
}


function handleCheer(channel, userstate, message) {
    bits = userstate.bits;
    console.log('Cheer event');
}
