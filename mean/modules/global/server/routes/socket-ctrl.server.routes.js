'use strict';

/****
 * 扩展网络通讯处理
 */
var path = require('path'),
  router = require('express').Router();

module.exports = function (app) {
  //启动socket
  var socketIo = require(path.resolve('./config/private/socket.io'));
  //配置服务有效
  if (socketIo.getIoServer()) {
    var socketsServerCtrl = require(path.resolve('./modules/global/server/sockets/server.server.socket'));
    var socketsPolicy = require('../policies/socket-ctrl.server.policy');
    // 五位一体调用同步
    router.route('/datasync').all(socketsPolicy.isAllowed)
      .post(socketsServerCtrl.dataSync);

    // 五位一体任务完成
    router.route('/handleend').all(socketsPolicy.isAllowed)
      .post(socketsServerCtrl.handleEnd);
    app.use('/api', router);
  }
  //配置客户端有效
  if (socketIo.getConnSocket()) {
    var socketsClientCtrl = require(path.resolve('./modules/global/server/sockets/client.server.socket'));
  }
};
