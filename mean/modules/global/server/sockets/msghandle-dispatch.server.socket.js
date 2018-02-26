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
function Cmd_Dispatch() {
  CommandSocketIo.apply(this, arguments); //call super constructor.
}
Cmd_Dispatch.prototype = Object.create(CommandSocketIo.prototype);
/*
Cmd_Dispatch.prototype.recvRespon = function (err, cmdRec) {
  if (err) {
    logger.warn('---Cmd_Dispatch recvrespon error:', err);
  } else {
    logger.debug('===Cmd_Dispatch recvrespon cmdRec:', cmdRec);
  }

  return Object.getPrototypeOf(Object.getPrototypeOf(this)).recvRespon(err, cmdRec);
};
*/

//请求对象
function Req_Dispatch() {
  RequestSocketIo.apply(this, arguments); //call super constructor.
}
Req_Dispatch.prototype = Object.create(RequestSocketIo.prototype);

// 请求处理
Req_Dispatch.prototype.recvRequest = function (reqRec) {
  //Object.getPrototypeOf(Object.getPrototypeOf(this)).recvRespon();
  logger.debug('Req_Dispatch recvrequest:', reqRec);
  //响应内容
  reqRec.msgsend = 'ggggdddd';
  //默认成功
  return Promise.resolve(RESULT.GOOD);
};

exports.Command = Cmd_Dispatch;
exports.Request = Req_Dispatch;
