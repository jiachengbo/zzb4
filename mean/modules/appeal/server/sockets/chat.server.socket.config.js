'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  socket.on('appeal', function (message) {
    io.emit('appeal', message);
  });
};
