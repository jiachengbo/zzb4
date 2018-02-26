'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  socket.on('problewall', function (message) {
    io.emit('problewall', message);
  });
};
