'use strict';

var path = require('path');

// Create the chat configuration
module.exports = function (io, socket) {
  var socketsCtrl = require(path.resolve('./modules/global/server/sockets/server.server.socket'));
  socketsCtrl.emit(socketsCtrl.EVENTTYPE.NEWSOCKET, socket, socket.request.user);
};
