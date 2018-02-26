'use strict';
var path = require('path'),
  MH_StateIn = require(path.resolve('./modules/global/server/sockets/msghandle-statein.server.socket')),
  MH_StateOut = require(path.resolve('./modules/global/server/sockets/msghandle-stateout.server.socket')),
  MH_Dispatch = require(path.resolve('./modules/global/server/sockets/msghandle-dispatch.server.socket')),
  MH_DataSync = require(path.resolve('./modules/global/server/sockets/msghandle-datasync.server.socket')),
  MHCfgList = require(path.resolve('./modules/private/server/sockets/msghandle-cfglist.server.socket')),
  logger = require(path.resolve('./config/lib/logger')).getLogger('socketio');

//可以处理的消息
var mhCfgList = new MHCfgList();
//消息处理默认参数
/*
 //是否需要回应
 respon: true,
 //最多尝试次数,当需要回应true时有效
 maxTimes: 3,
 //超时时间，单位毫秒,在命令处理中当需要回应true时有效，在请求处理中有效
 timeout: 1000
 */
//案件进入某状态
mhCfgList.addMsgCfg(
  //消息编码
  'STATEIN',
  //命令处理类
  MH_StateIn.Command,
  //请求处理类
  null,
  //消息参数
  {
    //是否需要回应,默认值true
    respon: false
  }
);
//案件离开某状态
mhCfgList.addMsgCfg('STATEOUT', MH_StateOut.Command, null, {respon: false});
//派发任务
mhCfgList.addMsgCfg('DISPATCH', MH_Dispatch.Command, MH_Dispatch.Request);
//数据同步
mhCfgList.addMsgCfg('DATASYNC', MH_DataSync.Command, MH_DataSync.Request);
//用户重新登录，给老的用户连接发送消息
//mhCfgList.addMsgCfg('USERRELOGIN', MH_UserReLogin.Command, null, {respon: false});

module.exports = mhCfgList;
