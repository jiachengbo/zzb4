'use strict';

/**
 * 服务器端处理
 * 1、通知消息：对于案件表的每个动作而产生的状态变化，发送消息到对应的连接组（房间），记录数据库，可丢失
 *    状态离开消息：（原状态id,案件id,动作内容），
 *    状态进入消息：（现状态id,案件id,动作内容）；
 * 2、派遣任务：对于包含接收人的案件动作，记录在数据库，单独发送，并等候回应，如果不成功，需要尝试多次，并在数据库中记录次数和发送结果；
 *   消息内容：案件表当前记录所有内容，不含关联表字段
 * 3、交互通讯：和街办客户端之间通讯交互，双向，记录在数据库，单独发送或响应，必须确认，如果不成功，需要尝试多次，
 *    并在数据库中记录次数和命令内容（请求内容）、响应内容、结果
 * 总结：
 *    合用数据表，表通用字段包含： 消息id, 用户id, 请求id（0-命令)，创建/请求时间，消息编码，消息参数，消息内容，响应内容，
 *      命令/请求尝试次数，最后发送时间，最后接收时间，结束结果（<0 失败， > 0 成功  0=未结束）
 *    对于1、2有案件信息的命令，还需要增加字段：案件id, 动作记录id
 *
 * 浏览器端：
 * 1、接收通知消息，并改变界面顶部通知标签，可选：动态通知提示
 * 2、接收对应登录用户的派遣任务信息，改变界面顶部任务标签，可选：动态通知提示
 * 3、界面刷新或登录后，主动获取通知消息和派遣任务，并改变界面顶部标签
 *
 * 街办客户端：
 *   发送命令到服务器端，接收响应；接收服务器端命令请求，处理请求，响应请求。
 *   在数据表中记录交互过程，字段和服务器端使用表格相同
 */
var path = require('path'),
  fs = require('fs'),
  EventEmitter = require('events'),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  putils = require(path.resolve('./config/private/utils')),
  dbTools = require(path.resolve('./config/private/dbtools')),
  groupSocket = require(path.resolve('./modules/private/server/sockets/server.server.socket')).groupSocket,
  UserTask = require(path.resolve('./modules/private/server/sockets/usertask.server.socket')),
  mhCfgList = require(path.resolve('./modules/global/server/sockets/server-msghandle-cfglist.server.socket')),
  hhCfgList = require(path.resolve('./modules/global/server/sockets/server-httphandle-cfglist.server.socket')),
  httpTaskCfgs = require(path.resolve('./modules/global/server/sockets/server-httptask-cfglist.server.socket')),
  constVALUES = require(path.resolve('./modules/global/server/config/const.server.config')),
  logger = require(path.resolve('./config/lib/logger')).getLogger('socketio.server');

//状态常量
const RECSTATES = constVALUES.RECSTATES;
//动作常量
const RECACT = constVALUES.RECACT;

//状态进入、离开消息名尾缀
const STATEIN_END = '_IN';
const STATEOUT_END = '_OUT';

//控制对象
function SocketsCtrl() {
  EventEmitter.call(this);
}
SocketsCtrl.prototype = Object.create(EventEmitter.prototype);

var socketsCtrl = new SocketsCtrl();
module.exports = socketsCtrl;

//事件定义
var EVENTTYPE = socketsCtrl.EVENTTYPE = {
  //案件记录改变
  TORECCHANGED: 'torecChanged',
  //有新的连接到达
  NEWSOCKET: 'newSocket'
};

//用户任务
var userTask = new UserTask(mhCfgList, 'socketio.server.usertask');

//http请求接收任务
var httpRecvTask = new UserTask(hhCfgList.hhRecvCfgList, 'socketio.server.httprecvtask');
var httpRecvTaskUser = 'httprecvtask';
httpRecvTask.runTask(httpRecvTaskUser, httpTaskCfgs);

//五位一体,数据同步
socketsCtrl.dataSync = function (req, res, next) {
  logger.debug('recv wwyt datasync header:', req.header('content-type'));
  httpRecvTask.callRecvRequest(httpRecvTaskUser, hhCfgList.hhRecvCfgList.DATASYNC, req, res, next);
};
//五位一体,处理结束
socketsCtrl.handleEnd = function (req, res, next) {
  logger.debug('recv wwyt handend');
  httpRecvTask.callRecvRequest(httpRecvTaskUser, hhCfgList.hhRecvCfgList.DISPATCH, req, res, next);
};

//http发送任务
var httpSendTask = new UserTask(hhCfgList.hhSendCfgList, 'socketio.server.httpsendtask');
var httpTaskArrayCfgs = httpTaskCfgs.getArrayCfgs();
httpTaskArrayCfgs.forEach(function (cfg) {
  httpSendTask.runTask(cfg.userId, cfg);
});

//发送状态改变消息
socketsCtrl.sendStateChangedMsg = function(isin, stateid, act, torec) {
  var stateName,
    groupName,
    msgHandleCfg,
    exclude = [],
    msgdata;

  stateName = putils.getValueName(stateid, RECSTATES);
  if (isin) {
    groupName = stateName + STATEIN_END;
    msgHandleCfg = mhCfgList.STATEIN;
    msgdata = {
      desc: 'in state: ' + stateName
    };
  } else {
    groupName = stateName + STATEOUT_END;
    msgHandleCfg = mhCfgList.STATEOUT;
    msgdata = {
      desc: 'out state: ' + stateName
    };
  }

  msgdata.act = act;
  msgdata.torec = torec;

  //需要发送的连接中去除动作人
  var actUserId = torec.get('lastact_userid');
  if (actUserId) {
    exclude.push(actUserId);
  }

  //取得发送的连接组,函数仅用于服务器端
  var users = groupSocket.getGroupUsers(groupName, exclude);
  //发送,附加案件、动作id
  return userTask.addSendRecs(users, msgHandleCfg, msgdata,
    {torecid: torec.id, actid: act.id});
};

//发送派遣任务消息
socketsCtrl.sendDispatchMsg = function(recvuserid, act, torec) {
  for (var i = 0; i < recvuserid.length; i++) {
    var user = recvuserid[i];

    //发送内容字段去掉act、crd字段
    var data = {desc: torec.lastact_content, act: act, torec: dbTools.getModelValues(torec)};
    var other = {torecid: torec.id, actid: act.id};

    //http发送任务
    if (httpSendTask.isValidUser(user)) {
      return httpSendTask.addSendRecs(user, hhCfgList.hhSendCfgList.DISPATCH, data, other);
    } else {
      return userTask.addSendRecs(user, mhCfgList.DISPATCH, data, other);
    }
  }
};

//案件记录改变
socketsCtrl.on(EVENTTYPE.TORECCHANGED, function (torec) {
  var acts = torec.get('act');
  if (!Array.isArray(acts) || acts.length === 0) {
    logger.error('recv torecChanged id act error', torec.id);
    return;
  }
  //最后的动作
  var act = acts[acts.length - 1];
  //新老状态
  var oldstate = act.old_state_id;
  var newstate = torec.get('state_id');

  logger.debug('recv torecChanged id %d, %s => %s',
    torec.id, putils.getValueName(oldstate, RECSTATES), putils.getValueName(newstate, RECSTATES));

  //如果状态改变，发送通知
  if (oldstate !== newstate) {
    if (oldstate) {
      this.sendStateChangedMsg(false, oldstate, act, torec);
    }

    if (newstate) {
      this.sendStateChangedMsg(true, newstate, act, torec);
    }
  }

  //如果动作有接收人，派遣任务
  var recvuserid = torec.get('lastact_recvuserid');
  if (recvuserid && recvuserid.length > 0) {
    this.sendDispatchMsg(recvuserid, act, torec);
  }
});

//新的客户端连接有效
socketsCtrl.on(EVENTTYPE.NEWSOCKET, function (socket, user) {
  //循环遍历用户是否有某个状态的权限，并加入分组
  for (var name in RECSTATES) {
    if (!RECSTATES.hasOwnProperty(name)) {
      continue;
    }
    var stateinName = name + STATEIN_END;
    var stateoutName = name + STATEOUT_END;

    if (user.roles.indexOf(stateinName) !== -1) {
      groupSocket.add(stateinName, socket);
    }
    if (user.roles.indexOf(stateoutName) !== -1) {
      groupSocket.add(stateoutName, socket);
    }
  }

  socket.on('disconnect', function () {
    userTask.clearUser(user);
  });

  //加载数据库中未完成的命令消息
  //监听、处理客户端的请求
  userTask.runTask(user, socket);
//测试
/*
  .then(function() {
    //userTask.addSendRecs(user, mhCfgList.STATEIN, {desc: '11111'});
    userTask.addSendRecs(user, mhCfgList.DISPATCH, {torec: {a: 1, b: 'bbbb'}});
  });
*/
});

/*
//数据同步请求测试
var request = require('request');
var formData = {
  wwyt_tableName: 'Article',
  wwyt_streetID: '10',
  wwyt_type: 1,
  'field[a]': 1,
  'field[b]': '222',
  title: fs.createReadStream(path.resolve('./public/dist/img/modules/private/client/img/mangrove.png'))
};
request.post({
  url: 'http://localhost:3000/api/datasync',
  formData: formData
}, function(err, response, body) {
  if (!err && response.statusCode === 200) {
    console.log('Upload successful!  Server responded with:', body);
  } else {
    return console.error('upload failed:', err, body);
  }
});
*/

/*
//任务完成请求测试
var request = require('request');
var formData = {
  wwyt_streetID: '6',
  streetIssueId: '38b7fd1501254100bf501c54fc62e5a2',
  result: 'fdsafdsafs',
  method: 'mmmmmmm',
  afterpic: fs.createReadStream(path.resolve('./public/dist/img/modules/private/client/img/mangrove.png'))
};
logger.debug('--------send handleend');
request.post({
  url: 'http://localhost:3000/api/handleend',
  formData: formData
}, function(err, response, body) {
  if (!err && response.statusCode === 200) {
    console.log('Upload successful!  Server responded with:', body);
  } else {
    return console.error('upload failed:', err, body);
  }
});
*/
