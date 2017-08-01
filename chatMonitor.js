var tmi = require('tmi.js');

var config = require('./config/config.json');
var auth = require('./config/auth.json');

var users = {};

module.exports.addClient = function(username, token) {
    // Do not add client if there is already one running for the user.
    if (username in users) {
        return;
    }

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
    newClient.on('chat', handleChat);
    newClient.on('subscription', handleSubscription);
    newClient.on('cheer', handleCheer);

    // Connect client.
    newClient.connect();
}


function handleChat(channel, userstate, message, self) {
    console.log('Chat event');
}


function handleSubscription(channel, username, method, message, userstate) {
    console.log('Sub event');
}


function handleCheer(channel, userstate, message) {
    bits = userstate.bits;
    console.log('Cheer event');
}
