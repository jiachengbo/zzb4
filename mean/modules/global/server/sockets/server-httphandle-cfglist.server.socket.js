'use strict';
var path = require('path'),
  HH_DataSync = require(path.resolve('./modules/global/server/sockets/httphandle-datasync.server.socket')),
  HH_DISPATCH = require(path.resolve('./modules/global/server/sockets/httphandle-dispatch.server.socket')),
  MHCfgList = require(path.resolve('./modules/private/server/sockets/msghandle-cfglist.server.socket')),
  logger = require(path.resolve('./config/lib/logger')).getLogger('socketio');


//可以接收的消息
var hhRecvCfgList = new MHCfgList();
//消息处理默认参数
//数据同步
hhRecvCfgList.addMsgCfg('DATASYNC', null, HH_DataSync.Request);
//任务完成
hhRecvCfgList.addMsgCfg('DISPATCH', null, HH_DISPATCH.Request);

//可以发送的消息
var hhSendCfgList = new MHCfgList();
//派发任务
hhSendCfgList.addMsgCfg('DISPATCH', HH_DISPATCH.Command);

exports.hhRecvCfgList = hhRecvCfgList;
exports.hhSendCfgList = hhSendCfgList;
