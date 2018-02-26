'use strict';
/*
 *数据同步命令
 */

var path = require('path'),
  RESULT = require(path.resolve('./modules/private/server/sockets/const.server.socket')).RESULT,
  Command = require(path.resolve('./modules/private/server/sockets/command.server.socket')),
  Request = require(path.resolve('./modules/private/server/sockets/request.server.socket')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  dbTools = require(path.resolve('./config/private/dbtools')),
  multer = require(path.resolve('./config/private/multer')),
  logger = require(path.resolve('./config/lib/logger')).getLogger('socketio.HttpDataSync');

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

  if (!data.wwyt_tableName || typeof(data.wwyt_tableName) !== 'string') {
    return '参数同步表名称 wwyt_tableName 无效或类型错误';
  }
  packet.tableName = data.wwyt_tableName.trim();

  if (!data.wwyt_streetID || typeof(data.wwyt_streetID) !== 'string') {
    return '参数同步街道 wwyt_streetID 无效或类型错误';
  }
  packet.streetID = data.wwyt_streetID.trim();

  //操作类型：数字
  tmp = Number(data.wwyt_type);
  if (isNaN(tmp) ||
    (tmp !== TYPE.ADD && tmp !== TYPE.UPDATE && tmp !== TYPE.DEL)) {
    return '参数同步类型 wwyt_type 错误';
  }
  packet.type = tmp;

  //不需要同步库的字段
  var nouse = ['wwyt_tableName', 'wwyt_streetID', 'wwyt_type'];
  //其余字段都是表格字段
  packet.field = {};
  //遍历所有字段，长度是0的去掉
  for (var name in data) {
    if (nouse.indexOf(name) === -1) {
      if (data[name].length !== 0) {
        packet.field[name] = data[name];
      } else {
        packet.field[name] = null;
      }
    }
  }
  return packet;
}

//命令对象
function Cmd_DataSync() {
  Command.apply(this, arguments); //call super constructor.
}
Cmd_DataSync.prototype = Object.create(Command.prototype);
Cmd_DataSync.prototype.recvRespon = function (err, cmdRec) {
  logger.debug('Cmd_DataSync recvrespon:', err, cmdRec);
  return Object.getPrototypeOf(Object.getPrototypeOf(this)).recvRespon(err, cmdRec);
};

//请求对象
function Req_DataSync() {
  Request.apply(this, arguments); //call super constructor.
}
Req_DataSync.prototype = Object.create(Request.prototype);

// 发送响应
Req_DataSync.prototype.sendRespon = function (err, reqRec, req, res, next) {
  if (res) {
    reqRec.lastsend_time = new Date();
    if (err) {
      res.status(422).send({
        message: err.message
      });
    } else {
      res.json(reqRec.msgsend);
    }
  } else {
    logger.error('REQUEST %s need respon, but res not valid', this.msgcode);
  }
};

//创建接收图片对象
var uploadFile = new multer('wwyt', 10 * 1024 * 1024);
//创建图片保存目录
uploadFile.mkPaths();

// 请求处理
Req_DataSync.prototype.recvRequest = function (reqRec, req, res) {
  //Object.getPrototypeOf(Object.getPrototypeOf(this)).recvRespon();
  //logger.debug('Req_DataSync recvrequest:', JSON.stringify(reqRec));

  var Model;
  var packet;
  //解析字段并接收文件所有文件
  return uploadFile.recv(req, res)
    .then(function (files) {
      logger.debug('Req_DataSync recvrequest body:', req.body);

      //记录收到的内容
      reqRec.msgrecv = req.body;
      reqRec.lastrecv_time = new Date();

      //根据接收的req.body增删改数据
      packet = checkPacket(req.body);
      if (typeof(packet) === 'string') {
        throw new Error('packet format error:' + packet);
      }

      //不区分大小写，取得模型
      Model = dbTools.getModel(packet.tableName);
      //判断模型是否存在
      if (!Model) {
        throw new Error('model:' + packet.tableName + ' not defined');
      }
      if (SCHEMA) {
        Model = Model.schema(SCHEMA);
      }

      if (Array.isArray(files)) {
        //记录接收的文件名称
        files.forEach(function (file) {
          packet.field[file.fieldname] = path.join(uploadFile.mountDir,
            file.filename).replace(/\\/g, '/');
          logger.debug('recv field %s,file %s => %s', file.fieldname, file.filename, packet.field[file.fieldname]);
        });
      }

      //判断表是否存在
      return Model.describe()
        .catch(function (err) {
          //创建表
          return Model.sync({loging: false});
        });
    })
    .then(function (result) {
      //强制修改街道id
      packet.field.streetID = packet.streetID;
      if (packet.type === TYPE.ADD) {
        //插入记录
        return Model.create(packet.field);
      } else {
        //查找关键字列
/*
        var priKey = Model.primaryKeyAttributes;
        var where = {};
        for (var i = 0; i < priKey.length; i++) {
          var keyName = priKey[i];
          if (!packet.field.hasOwnProperty(keyName)) {
            throw new Error('field no key:' + keyName);
          }
          where[keyName] = packet.field[keyName];
        }
*/
        var where = Model.build(packet.field).where();
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
