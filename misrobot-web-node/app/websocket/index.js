'use strict';

// const path = require('path');
// const http = require('http');
const socketio = require('socket.io');
const SessionSockets = require('session.socket.io');

module.exports = (server, redisStore, cookieParser) => {
    
    const io = socketio(server);

    // websocket module
    require('./ws-medicine')(io);
};
