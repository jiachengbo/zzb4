'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  socket.on('task', function (message) {
    io.emit('task', message);
  });
  socket.on('reply', function (message) {
    io.emit('reply', message);
  });
};
