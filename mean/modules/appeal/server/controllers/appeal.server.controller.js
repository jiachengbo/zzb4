'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename),
  uuid = require('uuid');

//创建党建活图片路径
var uploadImage = new multer('appealimg',
  10 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();

var Appealsb = sequelize.model('appealsb');

/**
 * Create an appeal
 */
exports.create = function (req, res) {
  var user = req.user;
  var Appeal = sequelize.model('appeal');
  var appeal = Appeal.build(req.body);
  appeal.appealId = uuid.v4().replace(/-/g, '');
  if (appeal) {
    uploadImage.recv(req, res, [{name: 'phoneOnePath'}, {name: 'photoTwoimagePath'}, {name: 'photoThreeimagePath'}])
      .then(updateUserInfo)
      .then(function () {
        res.json(appeal.appealId);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (appeal) {
        //图片1
        if (files && files.phoneOnePath && files.phoneOnePath.length === 1) {
          appeal.phoneOnePath = path.join(uploadImage.mountDir, files.phoneOnePath[0].filename).replace(/\\/g, '/');
          appeal.phoneOnePath = 'http://113.140.83.174:3000' + appeal.phoneOnePath;
        }
        //图片2
        if (files && files.photoTwoimagePath && files.photoTwoimagePath.length === 1) {
          appeal.photoTwoimagePath = path.join(uploadImage.mountDir, files.photoTwoimagePath[0].filename).replace(/\\/g, '/');
          appeal.photoTwoimagePath = 'http://113.140.83.174:3000' + appeal.photoTwoimagePath;
        }
        //图片3
        if (files && files.photoThreeimagePath && files.photoThreeimagePath.length === 1) {
          appeal.photoThreeimagePath = path.join(uploadImage.mountDir, files.photoThreeimagePath[0].filename).replace(/\\/g, '/');
          appeal.photoThreeimagePath = 'http://113.140.83.174:3000' + appeal.photoThreeimagePath;
        }
        // appeal.appealId = uuid.v4().replace(/-/g, '');
        appeal.createDate = new Date().toLocaleString();
        appeal.appealTitle = req.body.appealTitle;
        appeal.appealContext = req.body.appealContext;
        appeal.createUser = req.body.createUser;
        appeal.context = req.body.context;
        appeal.state = req.body.state;
        appeal.sbtime = req.body.sbtime;
        // appeal.communityId = req.body.communityId;
        // appeal.gridId = req.body.gridId;
        // appeal.streetID = req.body.streetID;
        appeal.gradeId = parseInt(user.user_grade, 0);
        appeal.roleId = parseInt(user.JCDJ_User_roleID, 0);
        appeal.PartyBranchID = parseInt(user.branch, 0);

        appeal.save().then(updateAppealSbTableInfo).then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no projectlogo img upload'));
      }
    });
  }

  // 写 数据到 上报 表
  function updateAppealSbTableInfo() {
    var ishow = req.body.ishow;
    var issb = req.body.issb;
    Appealsb.create({
      appealId: appeal.appealId,
      gradeId: parseInt(user.user_grade, 0),
      roleId: parseInt(user.JCDJ_User_roleID, 0),
      PartyBranchID: parseInt(user.user_grade, 0) > 8 ? req.body.PartyBranchID : parseInt(user.branch, 0),
      sbtime: appeal.sbtime,
      ishow: ishow,
      issb: issb
    }).then(function (data) {
      // console.info('98');
    }).catch(function (err) {
      console.info(err);
    });
  }

};

/**
 * Show the current appeal
 */
exports.read = function (req, res) {
  var appeal = req.model ? req.model.toJSON() : {};
  appeal.isCurrentUserOwner = !!(req.user && appeal.user && appeal.user.id.toString() === req.user.id.toString());

  res.json(appeal);
};

/**
 * Update an appeal
 */
exports.update = function (req, res) {
  var appeal = req.model;
  var user = req.user;
  var phoneOnePathNew;
  var phoneOnePathOld;
  var photoTwoimagePathNew;
  var photoTwoimagePathOld;
  var photoThreeimagePathNew;
  var photoThreeimagePathOld;
  if (appeal) {
    phoneOnePathOld = appeal.phoneOnePath;
    photoTwoimagePathOld = appeal.photoTwoimagePath;
    photoThreeimagePathOld = appeal.photoThreeimagePath;
    uploadImage.recv(req, res, [{name: 'phoneOnePath'}, {name: 'photoTwoimagePath'}, {name: 'photoThreeimagePath'}])
      .then(updateUserInfo)
      .then(deleteOldImg)
      .then(function () {
        res.json(appeal);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (appeal) {
        //图片1
        if (files && files.phoneOnePath && files.phoneOnePath.length === 1) {
          appeal.phoneOnePath = path.join(uploadImage.mountDir, files.phoneOnePath[0].filename).replace(/\\/g, '/');
          phoneOnePathNew = appeal.phoneOnePath;
          appeal.phoneOnePath = 'http://113.140.83.174:3000' + appeal.phoneOnePath;
        }
        //图片2
        if (files && files.photoTwoimagePath && files.photoTwoimagePath.length === 1) {
          appeal.photoTwoimagePath = path.join(uploadImage.mountDir, files.photoTwoimagePath[0].filename).replace(/\\/g, '/');
          photoTwoimagePathNew = appeal.photoTwoimagePath;
          appeal.photoTwoimagePath = 'http://113.140.83.174:3000' + appeal.photoTwoimagePath;
        }
        //图片3
        if (files && files.photoThreeimagePath && files.photoThreeimagePath.length === 1) {
          appeal.photoThreeimagePath = path.join(uploadImage.mountDir, files.photoThreeimagePath[0].filename).replace(/\\/g, '/');
          photoThreeimagePathNew = appeal.photoThreeimagePath;
          appeal.photoThreeimagePath = 'http://113.140.83.174:3000' + appeal.photoThreeimagePath;
        }
        appeal.appealTitle = req.body.appealTitle;
        appeal.appealContext = req.body.appealContext;
        appeal.createUser = req.body.createUser;
        appeal.context = req.body.context;
        appeal.state = req.body.state;
        appeal.sbtime = req.body.sbtime;
        // appeal.communityId = req.body.communityId;
        // appeal.gridId = req.body.gridId;
        // appeal.streetID = req.body.streetID;
        var ishow = req.body.ishow;
        var issb = req.body.issb;

        appeal.save().then(function () {
          //根据 是否前台 与 是否 推送 单独修改 关联表数据
          Appealsb.findOne({
            where: {
              appealId: req.body.appealId,
              gradeId: user.user_grade,
              roleId: user.JCDJ_User_roleID
            }
          }).then(function (appealsb) {
            appealsb.ishow = parseInt(ishow, 0);
            appealsb.issb = parseInt(issb, 0);
            appealsb.sbtime = appeal.sbtime;
            appealsb.save().then(function () {
              console.info('修改sb ok');
            }).catch(function (err) {
              console.info('修改sb失败', err);
            });
          });
        }).then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no projectlogo img upload'));
      }
    });
  }

  // 删除旧照片
  function deleteOldImg() {
    return new Promise(function (resolve, reject) {
      if (phoneOnePathOld && phoneOnePathNew) {
        var oldfilename1 = phoneOnePathOld.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename1, function (unlinkError) {
          if (unlinkError) {
            resolve();
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
      if (photoTwoimagePathNew && photoTwoimagePathOld) {
        var oldfilename2 = photoTwoimagePathOld.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename2, function (unlinkError) {
          if (unlinkError) {
            resolve();
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
      if (photoThreeimagePathNew && photoThreeimagePathOld) {
        var oldfilename3 = photoThreeimagePathOld.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename3, function (unlinkError) {
          if (unlinkError) {
            resolve();
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

};

/**
 * Delete an appeal
 */
exports.delete = function (req, res) {
  console.info('delete');
  /*
   console.info(req.body);
   var user = req.user;
   Appealsb.findOne({
   where: {
   appealId: req.body.appealId,
   gradeId: user.user_grade,
   roleId: user.JCDJ_User_roleID
   }
   }).then(function (appealsb) {
   appealsb.ishow = parseInt(ishow);
   appealsb.issb = parseInt(issb);
   appealsb.save().then(function () {
   console.info('修改sb ok');
   }).catch(function (err) {
   console.info('修改sb失败', err);
   });
   })*/
  /*
   var appeal = req.model;

   appeal.destroy().then(function () {
   res.json(appeal);
   }).catch(function (err) {
   return res.status(422).send({
   message: errorHandler.getErrorMessage(err)
   });
   });*/
};

/**
 * List of Appeal
 */
exports.list = function (req, res) {
  //var Appeal = sequelize.model('appeal');
  var grade = parseInt(req.user.user_grade, 0);
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
  var offset = parseInt(req.query.offset, 0);//10 每页总数
  var jb = parseInt(req.query.jb, 0);
  var PartyBranchID = req.query.PartyBranchID;
  var gradeId = grade === 1 ? req.query.gradeId : grade;//gradeId
  var roleId = grade === 1 ? req.query.role : parseInt(req.user.JCDJ_User_roleID, 0);//roleId
  var branchId = grade > 8 ? PartyBranchID : parseInt(req.user.branch, 0);
  var cont = req.query.cont;
  var sum = req.query.sum;
  // logger.info('----------------------------------------------');
  if (sum) {
    listByPage(req, res, limit, offset, jb, gradeId, roleId, branchId);
  } else if (cont) {
    listCount(req, res, jb, gradeId, roleId, branchId);
  }
  /*Appeal.findAll({
   order: 'id desc'
   }).then(function (appeal) {
   return res.jsonp(appeal);
   }).catch(function (err) {
   logger.error('appeal list error:', err);
   return res.status(422).send(err);
   });*/
};
//---------mysql-分页------------
function listByPage(req, res, limit, offset, jb, gradeId, roleId, branchId) {
//  var Appeal = sequelize.model('Appeal');
  var sqlzb = '';
  if (gradeId > 5) {
    // 如果是党支部或者党总支 登录，增加过滤条件
    sqlzb = ' and PartyBranchID =  ' + branchId;
  }
  /*
   var sql = 'select * from ( select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY id desc) AS rowNum, ' +
   ' appealId, appealTitle, appealContext, imagePath,phoneOnePath ,photoTwoimagePath ,photoThreeimagePath , isdelete, context, createUser, createDate, modifyUser, ' +
   'modifyDate, communityId, gridId, state, current_PT_type, SB_time, HF_time, streetID, HF_text, JB_HF_text, ' +
   'is_syn FROM appeal where streetID = ' + jb + ' and isdelete = 0) p where rownum <= ' + offset + ') z where rnum > ' + limit + ' ';*/
  var sql;
  if (gradeId === 1) {
    sql = `select A.*, B.current_PT_type,B.state,B.createUser,B.streetID,
      B.appealTitle,B.appealContext,B.phoneOnePath,B.photoTwoimagePath,B.photoThreeimagePath,
      B.context,B.sbtime from (select * from (select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY sbtime desc) AS rowNum, * FROM appealsb where gradeId in (1,2,3) and roleId = 25) p
    where rownum <= 20) z where rnum > 0 ) A left join (select bb.* from appeal bb)B on (A.appealId=B.appealId)`;
  } else {
    sql = 'select A.*, B.current_PT_type,B.state,B.createUser,B.streetID,B.appealTitle,B.appealContext,B.phoneOnePath,B.photoTwoimagePath,B.photoThreeimagePath,B.context,B.sbtime from (select * from (select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY sbtime desc) AS rowNum, * FROM appealsb where gradeId = ' + gradeId + ' and roleId = ' + roleId + sqlzb + ') p where rownum <= ' + offset + ') z where rnum > ' + limit + ' ) A left join (select bb.* from appeal bb)B on (A.appealId=B.appealId)';
  }

  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('Appeal list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数------------
function listCount(req, res, jb, gradeId, roleId, branchId) {
  var sql = 'select count(*) sum from appealsb where gradeId = ' + gradeId + ' and roleId = ' + roleId;
  if (gradeId > 5) {
    sql += ' and PartyBranchID = ' + branchId;
  }
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}
/**
 * Appeal middleware
 */
exports.appealByID = function (req, res, next, id) {
  var Appeal = sequelize.model('appeal');
  /* var grade = parseInt(req.user.user_grade, 0);
   var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
   var offset = parseInt(req.query.offset, 0);//10 每页总数
   var jb = parseInt(req.query.jb, 0);
   var PartyBranchID = req.query.PartyBranchID;
   var gradeId = grade === 1 ? req.query.gradeId : grade;//gradeId
   var roleId = grade === 1 ? req.query.role : parseInt(req.user.JCDJ_User_roleID, 0);//roleId
   var branchId = grade > 8 ? PartyBranchID : parseInt(req.user.branch, 0);
   if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, jb, gradeId, roleId, branchId);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, jb, gradeId, roleId, branchId);
   } else if (id !== '0') {*/
  Appeal.findOne({
    where: {appealId: id}
  }).then(function (appeal) {
    if (!appeal) {
      logger.error('No appeal with that identifier has been found');
      return res.status(404).send({
        message: 'No appeal with that identifier has been found'
      });
    }

    req.model = appeal;
    next();
  }).catch(function (err) {
    logger.error('appeal ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
// }
};
