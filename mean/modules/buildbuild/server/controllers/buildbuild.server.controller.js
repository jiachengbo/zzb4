'use strict';

/**
 * Module dependencies
 * 共驻共建 活动 图文
 */
var path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  util = require('util'),
  child_process = require('child_process'),
  socketsCtrl = require(path.resolve('./modules/global/server/controllers/wordhtml.js')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

//创建会议照片
var uploadImage = new multer('buildbuildimg',
  20 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();

//创建接收图片的对象
// var saveDir = 'buildbuildimg';
// var diskDir1 = path.resolve(config.uploads.rootDiskDir, saveDir);
// var mountDir1 = path.join(config.uploads.rootMountDir, saveDir).replace(/\\/g, '/');
// //目标文件类型
// var distType = 'html';
// //不同类型参数
// var typeParam = {
//   //html 字符集utf-8
//   html: ':XHTML Writer File:UTF8'
// };
var BuildbuildPerson = sequelize.model('BuildbuildPerson');
/**
 * Create an buildbuild
 */
exports.create = function (req, res) {
  var Buildbuild = sequelize.model('Buildbuild');
  var buildbuild = Buildbuild.build(req.body);
  var user = req.user;
  var existingFileUrl;
  var newingFileUrl;
  var existingImagejpg;
  if (buildbuild) {
    uploadImage.recv(req, res, [{name: 'photo'}, {name: 'docFile'}])
      .then(updateMeetingInfo)
      .then(updateBuildbuildPerson)
      .then(function () {
        res.json(buildbuild.id);
      })
      .catch(function (err) {
        logger.error('新增异常:', err);
        res.status(422).send(err);
      });
  }

  function updateBuildbuildPerson() {
    //Relation
    var Relation = req.body.Relation;
    // console.info('---Relation---', Relation);
    // var hdId = buildbuild.id;
    for (var r = 0; r < Relation.length; r++) {
      BuildbuildPerson.create({
        hdId: buildbuild.id,
        gradeId: Relation[r].gradeId,
        roleId: Relation[r].roleId,
        branchId: Relation[r].branchId,
        communityId: Relation[r].communityId,
        streetID: Relation[r].streetID
      }).then(function (data) {
        console.log('共驻共建活动参与成员插入成功！');
      }).catch(function (err) {
        console.log('共驻共建活动参与成员插入出错了！');
      });
    }
  }

  function updateMeetingInfo(files) {
    return new Promise(function (resolve, reject) {
      if (buildbuild) {
        //图片
        if (files && files.photo && files.photo.length === 1) {
          buildbuild.photo = path.join(uploadImage.mountDir, files.photo[0].filename).replace(/\\/g, '/');
        }
        if (files && files.docFile && files.docFile.length === 1) {
          buildbuild.docFile = path.join(uploadImage.mountDir, files.docFile[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.docFile[0].filename).replace(/\\/g, '/');
          newingFileUrl = buildbuild.docFile;
          socketsCtrl.get(files.docFile[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        buildbuild.title = req.body.title;
        buildbuild.details = req.body.details;
        buildbuild.sbtime = req.body.sbtime;
        buildbuild.gradeId = parseInt(user.user_grade, 0);
        buildbuild.roleId = parseInt(user.JCDJ_User_roleID, 0);
        buildbuild.branchId = parseInt(user.branch, 0);

        /*//Relation
         var Relation = req.body.Relation;
         console.info('Relation', Relation);*/
        //图片
        /*if (files && files.docFile && files.docFile.length === 1) {
         existingFileUrl = path.join(mountDir1, files.docFile[0].filename).replace(/\\/g, '/');
         //  转HTML
         var diskFileName = path.join(diskDir1, files.docFile[0].filename);
         fs.exists(diskFileName, function (exists) {
         if (!exists) {
         logger.warn('conv docfile %s not exists', diskFileName);
         return res.status(404).send('参数文件不存在:' + diskFileName);
         }
         var type = distType + (typeParam[distType] ? typeParam[distType] : '');
         var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
         config.sofficePathName, type, diskDir1, diskFileName);

         child_process.exec(cmdLine, function (error, stdout, stderr) {
         if (error) {
         logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
         return res.status(404).send('文件转换错误:' + diskFileName);
         }
         var distFile = path.basename(files.docFile[0].filename, path.extname(files.docFile[0].filename)) + '.' + distType;
         var distFileName = path.join(diskDir1, distFile);
         fs.exists(distFileName, function (exists) {
         if (!exists) {
         return res.status(404).send('转换后的文件不存在:' + distFileName);
         }
         var options = {};
         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
         newingFileUrl = distFileName1;
         buildbuild.docFile = distFileName1;
         buildbuild.save().then(function () {
         resolve();
         }).then()
         .catch(function (err) {
         reject(err);
         });
         });
         });
         });
         }*/
        //if (!(files && files.docFile && files.docFile.length === 1)) {
        buildbuild.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no photo img upload'));
      }
    });
  }
};

/**
 * Show the current buildbuild
 */
exports.read = function (req, res) {
  var buildbuild = req.model ? req.model.toJSON() : {};
  buildbuild.isCurrentUserOwner = !!(req.user && buildbuild.user && buildbuild.user.id.toString() === req.user.id.toString());

  res.json(buildbuild);
};

/**
 * Update an buildbuild
 */
exports.update = function (req, res) {
  var buildbuild = req.model;
  var user = req.user;
  var existingImageUrl;
  var newingImageUrl;
  var existingFileUrl;
  var newingFileUrl;
  var existingImagejpg;
  if (buildbuild) {
    existingImageUrl = buildbuild.photo;
    existingFileUrl = buildbuild.docFile;
    uploadImage.recv(req, res, [{name: 'photo'}, {name: 'docFile'}])
      .then(updateMeetingInfo)
      .then(deleteOldImage)
      // .then(deleteOldFile)
      .then(function () {
        res.json(buildbuild);
      })
      .catch(function (err) {
        logger.error('recv upload buildbuild picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'buildbuild is not exist'
    });
  }

  function updateMeetingInfo(files) {
    return new Promise(function (resolve, reject) {
      if (buildbuild) {
        //图片
        if (files && files.photo && files.photo.length === 1) {
          buildbuild.photo = path.join(uploadImage.mountDir, files.photo[0].filename).replace(/\\/g, '/');
        }
        if (files && files.docFile && files.docFile.length === 1) {
          buildbuild.docFile = path.join(uploadImage.mountDir, files.docFile[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.docFile[0].filename).replace(/\\/g, '/');
          newingFileUrl = buildbuild.docFile;
          socketsCtrl.get(files.docFile[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        buildbuild.title = req.body.title;
        buildbuild.details = req.body.details;
        //图片
        /*if (files && files.docFile && files.docFile.length === 1) {
         existingFileUrl = path.join(mountDir1, files.docFile[0].filename).replace(/\\/g, '/');
         //  转HTML
         var diskFileName = path.join(diskDir1, files.docFile[0].filename);
         fs.exists(diskFileName, function (exists) {
         if (!exists) {
         logger.warn('conv docfile %s not exists', diskFileName);
         return res.status(404).send('参数文件不存在:' + diskFileName);
         }
         var type = distType + (typeParam[distType] ? typeParam[distType] : '');
         var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
         config.sofficePathName, type, diskDir1, diskFileName);

         child_process.exec(cmdLine, function (error, stdout, stderr) {
         if (error) {
         logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
         return res.status(404).send('文件转换错误:' + diskFileName);
         }
         var distFile = path.basename(files.docFile[0].filename, path.extname(files.docFile[0].filename)) + '.' + distType;
         var distFileName = path.join(diskDir1, distFile);
         fs.exists(distFileName, function (exists) {
         if (!exists) {
         return res.status(404).send('转换后的文件不存在:' + distFileName);
         }
         var options = {};
         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
         newingFileUrl = distFileName1;
         buildbuild.docFile = distFileName1;
         buildbuild.save().then(function () {
         resolve();
         }).catch(function (err) {
         reject(err);
         });
         });
         });
         });
         }*/
        //if (!(files && files.docFile && files.docFile.length === 1)) {
        buildbuild.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no photo img upload'));
      }
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl && newingImageUrl) {
        var oldfilename = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename, function (unlinkError) {
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

  // function deleteOldFile() {
  //   return new Promise(function (resolve, reject) {
  //     if (existingOldFileUrl && newingFileUrl) {
  //       var oldfile = existingOldFileUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
  //       fs.unlink(oldfile, function (unlinkError) {
  //         if (unlinkError) {
  //           resolve();
  //         } else {
  //           resolve();
  //         }
  //       });
  //     } else {
  //       resolve();
  //     }
  //   });
  // }

};

/**
 * Delete an buildbuild
 */
exports.delete = function (req, res) {
  /*
   var buildbuild = req.model;
   var id = buildbuild.id;*/
  /*
   buildbuild.destroy().then(function () {
   res.json(buildbuild);
   }).catch(function (err) {
   return res.status(422).send({
   message: errorHandler.getErrorMessage(err)
   });
   });*/
};

/**
 * List of Buildbuild
 */
exports.list = function (req, res) {
  var Buildbuild = sequelize.model('Buildbuild');
  var grade = parseInt(req.user.user_grade, 0);
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
  var offset = parseInt(req.query.offset, 0);//10 每页总数
  var gradeId = grade === 1 ? req.query.gradeId : grade;//gradeId
  var roleId = grade === 1 ? req.query.role : parseInt(req.user.JCDJ_User_roleID, 0);//roleId
  var branchId = (gradeId === 10 || gradeId === 9) ? req.query.branch : parseInt(req.user.branch, 0);//branchId
  var cont = req.query.cont;
  var sum = req.query.sum;
  if (sum) {
    listByPage(req, res, limit, offset, gradeId, roleId, branchId);
  } else if (cont) {
    listCount(req, res, gradeId, roleId, branchId);
  } else {
    Buildbuild.findAll({
      order: 'id desc'
    }).then(function (buildbuild) {
      return res.jsonp(buildbuild);
    }).catch(function (err) {
      logger.error('buildbuild list error:', err);
      return res.status(422).send(err);
    });
  }
};

//----分页
function listByPage(req, res, limit, offset, gradeId, roleId, branchId) {
  // var Buildbuild = sequelize.model('Buildbuild');
  var sqls;
  if (gradeId === 10) {
    sqls = 'gradeId in (7, 10) and branchId in ( ' + branchId + ')';
  } else if (gradeId === 9) {
    sqls = 'gradeId in (6, 9) and branchId in ( ' + branchId + ')';
  } else if (gradeId === 7 || gradeId === 6) {
    sqls = 'gradeId = ' + gradeId + ' and branchId = ' + branchId;
  } else {
    sqls = 'gradeId = ' + gradeId + ' and roleId = ' + roleId;
  }
  var sql = 'select A.*, B.id as _hdid, B.title,B.sbtime, B.details, B.photo, B.docFile, B.gradeId as _gradeId, B.roleId as _roleId, B.branchId as _branchId from ( select * from ( select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY id desc) AS rowNum, * FROM BuildbuildPerson where ' + sqls + ' ) p where rownum <= ' + offset + ') z where rnum > ' + limit + ' ) A left join (select bb.* from Buildbuild bb)B on (A.hdId=B.id)';
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (buildbuild) {
    return res.jsonp(buildbuild);
  }).catch(function (err) {
    logger.error('Buildbuild list error:', err);
    return res.status(422).send(err);
  });
  /*var where;
   if(gradeId === 10){
   where = {
   gradeId: [7, 10],
   branchId: branchId
   };
   }else if(gradeId === 9){
   where = {
   gradeId: [6, 9],
   branchId: branchId
   };
   }else{
   where = {
   gradeId: gradeId,
   roleId: roleId
   };
   }
   var BuildbuildPerson = sequelize.model('BuildbuildPerson');
   var Buildbuild = sequelize.model('Buildbuild');
   BuildbuildPerson.findAll({
   where: where,
   order: 'id desc'
   }).then(function (BuildbuildPerson) {
   var arr = [];
   BuildbuildPerson.forEach(function (v, k) {
   if(arr.indexOf(v.dataValues.hdId) === -1){
   arr.push(v.dataValues.hdId);
   }
   });
   get(arr);
   }).catch(function (err) {
   logger.error('buildbuild list error:', err);
   return res.status(422).send(err);
   });
   function get(aa) {
   Buildbuild.findAll({
   where: {
   id: aa
   },
   limit: 20,
   offset: limit,
   order: 'id desc'
   }).then(function (Buildbuild) {
   return res.jsonp(Buildbuild);
   }).catch(function (err) {
   logger.error('buildbuild list error:', err);
   return res.status(422).send(err);
   });
   }*/
}
//---------总数
function listCount(req, res, gradeId, roleId, branchId) {
  var sqls;
  if (gradeId === 10) {
    sqls = 'gradeId in (7, 10) and branchId in ( ' + branchId + ')';
  } else if (gradeId === 9) {
    sqls = 'gradeId in (6, 9) and branchId in ( ' + branchId + ')';
  } else if (gradeId === 7 || gradeId === 6) {
    sqls = 'gradeId = ' + gradeId + ' and branchId = ' + branchId;
  } else {
    sqls = 'gradeId = ' + gradeId + ' and roleId = ' + roleId;
  }
  var sql = 'select count(*) sum from BuildbuildPerson where ' + sqls;
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
  /*var where;
   if(gradeId === 10){
   where = {
   gradeId: [7, 10],
   branchId: branchId
   };
   }else if(gradeId === 9){
   where = {
   gradeId: [6, 9],
   branchId: branchId
   };
   }else{
   where = {
   gradeId: gradeId,
   roleId: roleId
   };
   }
   var BuildbuildPerson = sequelize.model('BuildbuildPerson');
   var Buildbuild = sequelize.model('Buildbuild');
   BuildbuildPerson.findAll({
   where: where,
   order: 'id desc'
   }).then(function (BuildbuildPerson) {
   var arr = [];
   BuildbuildPerson.forEach(function (v, k) {
   if(arr.indexOf(v.dataValues.hdId) === -1){
   arr.push(v.dataValues.hdId);
   }
   });
   return res.jsonp(arr);
   }).catch(function (err) {
   logger.error('buildbuild list error:', err);
   return res.status(422).send(err);
   });*/
}
/**
 * Buildbuild middleware
 */
exports.buildbuildByID = function (req, res, next, id) {
  /*var grade = parseInt(req.user.user_grade, 0);
   var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
   var offset = parseInt(req.query.offset, 0);//10 每页总数
   var gradeId = grade === 1 ? req.query.gradeId : grade;//gradeId
   var roleId = grade === 1 ? req.query.role : parseInt(req.user.JCDJ_User_roleID, 0);//roleId
   var branchId = (gradeId === 10 || gradeId === 9) ? req.query.branch : parseInt(req.user.branch, 0);//branchId*/
  var Buildbuild = sequelize.model('Buildbuild');
  /*if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, gradeId, roleId, branchId);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, gradeId, roleId, branchId);
   } else if (id !== '0') {*/
  Buildbuild.findOne({
    where: {id: id}
  }).then(function (buildbuild) {
    if (!buildbuild) {
      logger.error('No buildbuild with that identifier has been found');
      return res.status(404).send({
        message: 'No buildbuild with that identifier has been found'
      });
    }
    req.model = buildbuild;
    next();
  }).catch(function (err) {
    logger.error('buildbuild ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
//  }
};

/*buildbuildpersonId
 exports.buildbuildByID = function (req, res, next, id) {
 var Buildbuild = sequelize.model('Buildbuild');

 Buildbuild.findOne({
 where: {id: id}
 }).then(function (buildbuild) {
 if (!buildbuild) {
 logger.error('No buildbuild with that identifier has been found');
 return res.status(404).send({
 message: 'No buildbuild with that identifier has been found'
 });
 }
 req.model = buildbuild;
 next();
 }).catch(function (err) {
 //return next(err);
 logger.error('buildbuild ByID error:', err);
 res.status(422).send({
 message: errorHandler.getErrorMessage(err)
 });
 });
 };
 */
