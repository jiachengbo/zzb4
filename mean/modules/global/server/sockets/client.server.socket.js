'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  EventEmitter = require('events'),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  connSocket = require(path.resolve('./config/private/socket.io')).getConnSocket(),
  UserTask = require(path.resolve('./modules/private/server/sockets/usertask.server.socket')),
  mhCfgList = require(path.resolve('./modules/global/server/sockets/client-msghandle-cfglist.server.socket')),
  constVALUES = require(path.resolve('./modules/global/server/config/const.server.config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  logger = require(path.resolve('./config/lib/logger')).getLogger('socketio.client');

//常量
const RECSTATES = constVALUES.RECSTATES;
const RECACT = constVALUES.RECACT;

//控制对象
function SocketsCtrl() {
  EventEmitter.call(this);
}
SocketsCtrl.prototype = Object.create(EventEmitter.prototype);

var socketsCtrl = new SocketsCtrl();
module.exports = socketsCtrl;

//用户任务
var userTask = new UserTask(mhCfgList, 'socketio.client.usertask');

//如果配置有连接，监听连接
if (connSocket) {
  connSocket.on('disconnect', function () {
    //清除用户任务
    userTask.clearUser(connSocket.usernameOrEmail);
  });

//console.log('socket id %s,connected %s', connSocket.id, connSocket.connected);
  connSocket.on('connect', function () {
    //加载数据库中未完成的命令消息
    //监听、处理客户端的请求
    userTask.runTask(connSocket.usernameOrEmail, connSocket);
  });

//测试
  //userTask.addSendRecs(connSocket.usernameOrEmail, mhCfgList.DISPATCH, {a: 10, b: 'bbbbb'});
/*
  userTask.addSendRecs(connSocket.usernameOrEmail, mhCfgList.DATASYNC, {
    tableName: 'Article',
    streetID: '10',
    type: 1,
    field: {a: 'aaa', b: 'bbb'}});
*/
}
