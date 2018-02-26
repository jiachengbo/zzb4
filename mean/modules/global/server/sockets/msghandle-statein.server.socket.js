'use strict';
/*
 *数据同步命令
 */

var path = require('path'),
  RESULT = require(path.resolve('./modules/private/server/sockets/const.server.socket')).RESULT,
  CommandSocketIo = require(path.resolve('./modules/private/server/sockets/command-socketio.server.socket')),
  RequestSocketIo = require(path.resolve('./modules/private/server/sockets/request-socketio.server.socket')),
  logger = require(path.resolve('./config/lib/logger')).getLogger('socketio');

//命令对象
function Cmd_StateIn() {
  CommandSocketIo.apply(this, arguments); //call super constructor.
}
Cmd_StateIn.prototype = Object.create(CommandSocketIo.prototype);
/*
//命令不需要响应，不会收到响应
*/

//请求对象
function Req_StateIn() {
  RequestSocketIo.apply(this, arguments); //call super constructor.
}
Req_StateIn.prototype = Object.create(RequestSocketIo.prototype);

// 请求处理
Req_StateIn.prototype.recvRequest = function (reqRec) {
  //Object.getPrototypeOf(Object.getPrototypeOf(this)).recvRespon();
  logger.debug('Req_StateIn recvrequest:', reqRec);
  //默认成功
  return Promise.resolve(RESULT.GOOD);
};

exports.Command = Cmd_StateIn;
exports.Request = Req_StateIn;
