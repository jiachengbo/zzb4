'use strict';
/*
 *数据同步命令
 */

var path = require('path'),
  fs = require('fs'),
  RESULT = require(path.resolve('./modules/private/server/sockets/const.server.socket')).RESULT,
  Command = require(path.resolve('./modules/private/server/sockets/command.server.socket')),
  Request = require(path.resolve('./modules/private/server/sockets/request.server.socket')),
  constVALUES = require(path.resolve('./modules/global/server/config/const.server.config')),
  multer = require(path.resolve('./config/private/multer')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

//常量
const RECSTATES = constVALUES.RECSTATES;
const RECACT = constVALUES.RECACT;

//命令对象
function Cmd_Dispatch() {
  Command.apply(this, arguments); //call super constructor.
}
Cmd_Dispatch.prototype = Object.create(Command.prototype);
/*
//收到命令响应
Cmd_Dispatch.prototype.recvRespon = function (err, cmdRec) {
  logger.debug('Cmd_Dispatch recvrespon:', err, cmdRec);
  return Object.getPrototypeOf(Object.getPrototypeOf(this)).recvRespon(err, cmdRec);
};
*/

//发送的消息结构
Cmd_Dispatch.prototype._buildMsg = function (cmdRec) {
  var packet = {};
  //检查请求的内容是否完整
  if (!cmdRec || typeof(cmdRec) !== 'object') {
    return 'cmdRec空或不是对象错误';
  }
  //案件记录
  var toRec = cmdRec.msgsend.torec;
  //socket中放置的用户街道信息
  //var cmdCfg = this.socket;

  //空白字段
  packet.streetIssueId = '';
  packet.communityId = '';
  packet.gridId = '';
  packet.roadId = '';
  packet.issueType = '';
  packet.issueTypeDetail = '';
  packet.status = '';
  packet.method = '';
  packet.result = '';
  packet.Beforepic2 = '';
  packet.Beforepic3 = '';
  packet.afterpic = '';
  packet.Afterpic2 = '';

  packet.issueObjectType = '组织';
  packet.issueObject = '区执法局下派';
  packet.issueAddress = toRec.address ? toRec.address : '';
  packet.issueContext = (toRec.eventdesc ? toRec.eventdesc : '') + '::' +
    toRec.lastact_content ? toRec.lastact_content : '';
  packet.createUser = '区执法局';
  packet.createDepartment = '区执法局';
  packet.createDate = (new Date()).toLocaleString();
  packet.lat = toRec.coordinatex + '';
  packet.lng = toRec.coordinatey + '';

  var create_photo = '';
  if (toRec.create_photo) {
    try {
      //base64编码字符串
      create_photo = fs.readFileSync(path.resolve('.' + toRec.create_photo), 'base64');
      //new Buffer(bitmap).toString('base64');
    } catch (err) {
      // no control
    }
  }
  packet.beforepic = create_photo;

  //街道办用户id
  packet.userID = this.socket.jdb_userID;

  return packet;
};

//发送命令请求
Cmd_Dispatch.prototype.sendCmd = function (cmdRec, wait4Respon, callBack) {
  var formData = this._buildMsg(cmdRec);
  if (typeof(formData) === 'string') {
    return callBack(new Error(formData), null);
  }

  var url = this.socket.url + '/saveStreetIssue_SZCG';
  logger.debug('send dispatch cmd to %s:', url, formData);

  var request = require('request');
  request.post({
    url: url,
    form: formData
  }, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      logger.debug('cmd %s recv good respon:', cmdRec.msgcode, body);

      //<?xml version="1.0" encoding="utf-8"?><string xmlns="http://tempuri.org/">1,1264ca28603f4470807f770e698dd009</string>
      //插入失败："0"
      //插入成功："1，ID"
      var regex = />(\S+)<\/string>$/m;
      var match = regex.exec(body);
      if (match && Array.isArray(match) && match[1]) {
        var resultArray = match[1].split(',');
        if (resultArray.length > 1 && resultArray[0] === '1') {
          logger.debug('cmd %s successful!  Server responded with:', cmdRec.msgcode, resultArray[1]);
          //返回五位一体案件id
          return callBack(null, resultArray[1]);
        }
      }
    }

    //logger.error('cmd %s send to %s response code %s failed:', cmdRec.msgcode,
    //  url, response.statusCode, err, body);
    if (!err) {
      err = new Error('cmd ' + cmdRec.msgcode + 'send to ' + url + ' response code ' + response.statusCode +
        ' failed:' + body);
    }
    callBack(err, body);
  });
};


//请求对象
function Req_Dispatch() {
  Request.apply(this, arguments); //call super constructor.
}
Req_Dispatch.prototype = Object.create(Request.prototype);

// 发送响应
Req_Dispatch.prototype.sendRespon = function (err, reqRec, req, res, next) {
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
    logger.error('request %s need respon, but res not valid', this.msgcode);
  }
};

//创建接收图片对象
var uploadImage = new multer('torec', 10 * 1024 * 1024,
  /image/, '.jpg');
//不用创建图片保存目录，目录已经在案件动作记录中创建
//uploadImage.mkPaths();

//通讯任务表数据模型
var CommTaskM = sequelize.model('CommTask');
// 请求处理
Req_Dispatch.prototype.recvRequest = function (reqRec, req, res) {
  var packet;
  var self = this;
  var Torec = sequelize.model('Torec');
  //解析字段并接收文件所有文件
  return uploadImage.recv(req, res)
    .then(function (files) {
      logger.debug('Req_Dispatch recvrequest:', req.body);

      //记录收到的内容
      reqRec.msgrecv = req.body;
      reqRec.lastrecv_time = new Date();

      //将接收的req.body,转换成act
      packet = checkPacket(req.body, self.socket);
      if (typeof(packet) === 'string') {
        throw new Error('packet format error:' + packet);
      }

      //记录接收的文件名称
      if (Array.isArray(files)) {
        files.forEach(function (file) {
          if (file.fieldname.toLowerCase() === 'afterpic') {
            packet.act.act_photo = path.join(uploadImage.mountDir,
              file.filename).replace(/\\/g, '/');
            logger.debug('recv field %s,file %s => %s', file.fieldname, file.filename, packet.act.act_photo);
          } else {
            logger.warn('ignore recv field %s,file %s => %s', file.fieldname, file.filename);
          }
        });
      }

      //查询回应的消息对应的任务记录
      return CommTaskM.findAll({
        where: {
          user: String(packet.other.userId),
          //正确下发
          result: RESULT.GOOD,
          //发送的命令
          reqid: null,
          //收到的包中含有五位一体案件的关键字
          //msgrecv: JSON.stringify(packet.other.streetIssueId)
          $and: sequelize.where(sequelize.fn('to_char', sequelize.col('msgrecv')), JSON.stringify(packet.other.streetIssueId))
        },
        order: 'id ASC'
      })
        .then(function (commTaskArray) {
          //没有数据
          if (commTaskArray.length <= 0) {
            throw new Error('packet key not find:' + packet.other.streetIssueId);
          }

          //任务关键字
          var toRecId = commTaskArray[commTaskArray.length - 1].torecid;
          //查找任务记录
          return Torec.findById(toRecId);
        })
        .then(function (torec) {
          if (!torec) {
            logger.error('torec findbyid find null error');
            throw new Error('Failed to load torec id ');
          } else {
            return torec.getAct({order: 'act_time ASC'})
              .then(function (acts) {
                torec.set('act', acts, {raw: true});

                //设置更新动作调用参数
                req.model = torec;
                req.user = {
                  id: packet.other.userId,
                  roles: []
                };
                req.body = packet;

                var toRecCtrl = require(path.resolve('./modules/private/server/controllers/torec.server.controller'));
                //调用更新处理,res置空，由本对象响应
                return toRecCtrl.update(req, null)
                  .then(function(result) {
                    if (result instanceof Error) {
                      throw result;
                    }
                  });
              });
          }
        });
    })
    .then(function (result) {
      reqRec.msgsend = 'dispatch request good';
      return RESULT.GOOD;
    });
};

//检查数据内容是否有效
function checkPacket(data, httpTaskCfgs) {
  var packet = {};
  //检查请求的内容是否完整
  if (!data || typeof(data) !== 'object') {
    return '请求包空或不是对象错误';
  }

  if (!data.wwyt_streetID || typeof(data.wwyt_streetID) !== 'string') {
    return '请求包字段 wwyt_streetID 无效或类型错误';
  }
  //关键字字段
  if (!data.streetIssueId || typeof(data.streetIssueId) !== 'string') {
    return '请求包字段 streetIssueId 无效或类型错误';
  }

  packet.other = {
    streetIssueId: data.streetIssueId.trim()
  };

  var streetCfg = httpTaskCfgs.getStreetCfg(data.wwyt_streetID.trim());
  if (!streetCfg) {
    return '请求包字段 wwyt_streetID 在http任务配置中没有找到';
  }
  packet.other.userId = streetCfg.userId;

  //执行结果内容
  if (!data.result || typeof(data.result) !== 'string') {
    return '请求包字段 result 无效或类型错误';
  }
  packet.act = {
    act_id: RECACT.HANDLERET,
    act_content: data.result,
    act_remark: data.method
  };
  return packet;
}

exports.Command = Cmd_Dispatch;
exports.Request = Req_Dispatch;
