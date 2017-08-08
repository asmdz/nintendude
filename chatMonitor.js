var tmi = require('tmi.js');

var config = require('./config/config.json');
var auth = require('./config/auth.json');

var users = {};
var chatClient;

module.exports.startClient = function() {
    var clientConfig = {
        options: {
            clientId: '',
            debug: true
        },
        identity: {
            username: 'BotZura',
            password: auth.chat_token
        },
        connection: {
            reconnect: true
        },
        channels: []
    };

    chatClient = new tmi.client(clientConfig);

    // Add event handler to client.
    chatClient.on('chat', handleChat);
    chatClient.on('subscription', handleSubscription);
    chatClient.on('cheer', handleCheer);

    chatClient.connect();
}

module.exports.addUser = function(username) {
    chatClient.join('#' + username);
};


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
