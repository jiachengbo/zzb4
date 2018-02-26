'use strict';
/*
 *数据同步命令
 */

var path = require('path'),
  RESULT = require(path.resolve('./modules/private/server/sockets/const.server.socket')).RESULT,
  CommandSocketIo = require(path.resolve('./modules/private/server/sockets/command-socketio.server.socket')),
  RequestSocketIo = require(path.resolve('./modules/private/server/sockets/request-socketio.server.socket')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  dbTools = require(path.resolve('./config/private/dbtools')),
  logger = require(path.resolve('./config/lib/logger')).getLogger('socketio.DataSync');

//表的schema
var SCHEMA = 'wwyt';

//同步类型：1-增加，2-修改，3-删除
var TYPE = {
  ADD: 1,
  UPDATE: 2,
  DEL: 3
};
//检查数据内容是否有效
function checkPacket(data) {
  var tmp;
  var packet = {};
  //检查请求的内容是否完整
  if (!data) {
    return '数据包空错误';
  }

  if (!data.tableName || typeof(data.tableName) !== 'string') {
    return '参数同步表名称tableName无效或类型错误';
  }
  packet.tableName = data.tableName.trim();

  if (!data.streetID || typeof(data.streetID) !== 'string') {
    return '参数同步街道id无效或类型错误';
  }
  packet.streetID = data.streetID.trim();

  //操作类型：数字
  tmp = Number(data.type);
  if (!data.type || isNaN(tmp) ||
    (tmp !== TYPE.ADD && tmp !== TYPE.UPDATE && tmp !== TYPE.DEL)) {
    return '参数同步类型type错误';
  }
  packet.type = tmp;

  if (!data.field || typeof(data.field) !== 'object') {
    return '参数同步记录数据field无效或类型错误';
  }
  packet.field = data.field;
  return packet;
}

//命令对象
function Cmd_DataSync() {
  CommandSocketIo.apply(this, arguments); //call super constructor.
}
Cmd_DataSync.prototype = Object.create(CommandSocketIo.prototype);

//请求对象
function Req_DataSync() {
  RequestSocketIo.apply(this, arguments); //call super constructor.
}
Req_DataSync.prototype = Object.create(RequestSocketIo.prototype);

// 请求处理
Req_DataSync.prototype.recvRequest = function (reqRec) {
  //Object.getPrototypeOf(Object.getPrototypeOf(this)).recvRespon();
  logger.debug('Req_DataSync recvrequest:', JSON.stringify(reqRec));

  //根据接收的reqRec.msgrecv增删改数据
  var packet = checkPacket(reqRec.msgrecv);
  if (typeof(packet) === 'string') {
    return Promise.reject(new Error('packet format error:' + packet));
  }

  //不区分大小写，取得模型
  var Model = dbTools.getModel(packet.tableName);
  //判断模型是否存在
  if (!Model) {
    return Promise.reject(new Error('model:' + packet.tableName + ' not defined'));
  }
  if (SCHEMA) {
    Model = Model.schema(SCHEMA);
  }
  //判断表是否存在
  return Model.describe()
    .catch(function (err) {
      //创建表
      return Model.sync({loging: false});
    })
    .then(function (result) {
      //强制修改街道id
      packet.field.streetID = packet.streetID;
      if (packet.type === TYPE.ADD) {
        //插入记录
        return Model.create(packet.field);
      } else {
        //查找关键字列
        var priKey = Model.primaryKeyAttributes;
        var where = {};
        for (var i = 0; i < priKey.length; i++) {
          var keyName = priKey[i];
          if (!packet.field.hasOwnProperty(keyName)) {
            throw new Error('field no key:' + keyName);
          }
          where[keyName] = packet.field[keyName];
        }

        return Model.findOne({where: where})
          .then(function (model) {
            if (!model) {
              throw new Error('no find record field key:' + JSON.stringify(where));
            }

            if (packet.type === TYPE.UPDATE) {
              //修改记录
              return model.update(packet.field);
            } else if (packet.type === TYPE.DEL) {
              //删除记录
              return model.destroy();
            } else {
              throw new Error('packet type error:' + packet.type);
            }
          });
      }
    })
    .then(function (result) {
      reqRec.msgsend = 'model:' + packet.tableName + ' type:' + packet.type + ' good';
      return RESULT.GOOD;
    });
};

exports.Command = Cmd_DataSync;
exports.Request = Req_DataSync;
exports.TYPE = TYPE;
exports.checkPacket = checkPacket;
