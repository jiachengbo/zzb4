'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  util = require('util'),
  child_process = require('child_process'),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  socketsCtrl = require(path.resolve('./modules/global/server/controllers/wordhtml.js')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

//创建项目进展对象
var saveDir = 'dj_MemberRelationOutPic';
// var diskDir1 = path.resolve(config.uploads.rootDiskDir, saveDir);
// var mountDir1 = path.join(config.uploads.rootMountDir, saveDir).replace(/\\/g, '/');
// //目标文件类型
// var distType = 'html';
// //不同类型参数
// var typeParam = {
//   //html 字符集utf-8
//   html: ':XHTML Writer File:UTF8'
// };
//创建图片对象
var uploadImage = new multer(saveDir, 10 * 1024 * 1024, /image/, '.jpg');
//创建目录
uploadImage.mkPaths();

/**
 * Show the current dj_MemberRelationOut
 */
exports.read = function (req, res) {
  var dj_MemberRelationOut = req.model ? req.model.toJSON() : {};

  //dj_MemberRelationOut.isCurrentUserOwner = !!(req.user && dj_MemberRelationOut.user && dj_MemberRelationOut.user._id.toString() === req.user._id.toString());
  dj_MemberRelationOut.isCurrentUserOwner = !!(req.user && dj_MemberRelationOut.user && dj_MemberRelationOut.user.id.toString() === req.user.id.toString());

  res.json(dj_MemberRelationOut);
};

/**
 * Update an dj_MemberRelationOut
 */
exports.update = function (req, res) {
  var dj_MemberRelationOut;
  var existingImageUrl;
  var existingFileUrl1;
  var existingImagejpg1;
  var newingImageUrl;
  var newingFileUrl1;
  var existingImagejpg;
  var newingFileUrl;
  var existingFileUrl;
  var isCreate = false;
  if (req.model) {
    isCreate = false;
    dj_MemberRelationOut = req.model;
  } else {
    isCreate = true;
    var dj_memberRelationOut = sequelize.model('dj_MemberRelationOut');
    dj_MemberRelationOut = dj_memberRelationOut.build(req.body);
  }
  if (dj_MemberRelationOut) {
    existingImageUrl = dj_MemberRelationOut.phonePath;
    existingFileUrl = dj_MemberRelationOut.filePath1;
    uploadImage.recv(req, res, [
      {name: 'phonePath'},
      {name: 'filePath1'}
    ])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(dj_MemberRelationOut);
      })
      .catch(function (err) {
        logger.error('recv upload dj_MemberRelationOut picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'dj_MemberRelationOut is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (dj_MemberRelationOut) {
        if (files && files.phonePath && files.phonePath.length === 1) {
          dj_MemberRelationOut.phonePath = path.join(uploadImage.mountDir, files.phonePath[0].filename).replace(/\\/g, '/');
          newingImageUrl = dj_MemberRelationOut.phonePath;
        }
        if (files && files.file_path && files.file_path.length === 1) {
          dj_MemberRelationOut.file_path = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/');
          newingFileUrl = dj_MemberRelationOut.file_path;
          socketsCtrl.get(files.file_path[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        dj_MemberRelationOut.card = req.body.card;//身份证号码
        dj_MemberRelationOut.memberName = req.body.memberName;//姓名
        dj_MemberRelationOut.sex = req.body.sex;//性别
        dj_MemberRelationOut.nation = req.body.nation;//民族
        dj_MemberRelationOut.birth = req.body.birth;//出生日期
        dj_MemberRelationOut.place = req.body.place;//籍贯
        dj_MemberRelationOut.outBranch = req.body.outBranch;//原所在支部
        dj_MemberRelationOut.tel = req.body.tel;//联系电话
        dj_MemberRelationOut.jointime = req.body.jointime;//入党时间
        dj_MemberRelationOut.workplace = req.body.workplace;//工作单位
        dj_MemberRelationOut.address = req.body.address;//家庭住址
        dj_MemberRelationOut.partycost = req.body.partycost;//月交党费
        dj_MemberRelationOut.inBranch = req.body.inBranch;//转入党支部
        if (isCreate) {
          dj_MemberRelationOut.createUser = req.body.createUser;//创建人ID
          dj_MemberRelationOut.createDate = new Date();
        }
        //文件
        // if (files && files.filePath1 && files.filePath1.length === 1) {
        //   existingImagejpg1 = path.join(mountDir1, files.filePath1[0].filename).replace(/\\/g, '/');
        //   var disk_FileName1 = path.join(diskDir1, files.filePath1[0].filename);
        //   fs.exists(disk_FileName1, function (exists) {
        //     if (!exists) {
        //       logger.warn('conv docfile %s not exists', disk_FileName1);
        //       return res.status(404).send('参数文件不存在:' + disk_FileName1);
        //     }
        //     var type1 = distType + (typeParam[distType] ? typeParam[distType] : '');
        //     var cmdLine1 = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
        //       config.sofficePathName, type1, diskDir1, disk_FileName1);
        //     child_process.exec(cmdLine1, function (error, stdout, stderr) {
        //       if (error) {
        //         logger.warn('conv docfile %s to pdf error:', disk_FileName1, error.message);
        //         return res.status(404).send('文件转换错误:' + disk_FileName1);
        //       }
        //
        //       var distFile1 = path.basename(files.filePath1[0].filename, path.extname(files.filePath1[0].filename)) + '.' + distType;
        //       var distFileName1 = path.join(diskDir1, distFile1);
        //       // aaa = distFileName.replace(/\\/g, '/');
        //       fs.exists(distFileName1, function (exists) {
        //         if (!exists) {
        //           return res.status(404).send('转换后的文件不存在:' + distFileName1);
        //         }
        //         var options = {};
        //         var dist_fileName1 = path.join(uploadImage.mountDir, distFile1).replace(/\\/g, '/');
        //         newingFileUrl1 = dist_fileName1;
        //         dj_MemberRelationOut.filePath1 = dist_fileName1;
        //         dj_MemberRelationOut.save().then(function () {
        //           return dj_MemberRelationOut.reload()
        //             .then(function () {
        //               resolve();
        //             });
        //         }).catch(function (err) {
        //           reject(err);
        //         });
        //       });
        //     });
        //   });
        // }
        if (!(files && files.filePath1 && files.filePath1.length === 1)) {
          dj_MemberRelationOut.save().then(function () {
            return dj_MemberRelationOut.reload()
              .then(function () {
                resolve();
              });
          }).catch(function (err) {
            reject(err);
          });
        }
      } else {
        reject(new Error('no dj_MemberRelationOut img upload'));
      }
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      // if (existingImagejpg1) {
      //   var oldjpg1 = existingImagejpg1.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldjpg1, function (unlinkError) {
      //   });
      // }
      // if (existingImageUrl && newingImageUrl) {
      //   var oldfilename = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldfilename, function (unlinkError) {
      //     if (unlinkError) {
      //       // resolve();
      //       /**/
      //       reject({
      //         message: '图片删除错误'
      //       });
      //     } else {
      //       resolve();
      //     }
      //   });
      // } else {
      //   resolve();
      // }
      if (existingFileUrl1 && newingFileUrl1) {
        var old_file1 = existingFileUrl1.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(old_file1, function (unlinkError) {
          if (unlinkError) {
            reject({message: '删除文件错误'});
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
      // if (existingImageUrl && newingImageUrl && existingFileUrl1 && newingFileUrl1) {
      //   var oldfile1 = existingFileUrl1.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldfile1, function (unlinkError) {
      //     if (unlinkError) {
      //       reject({message: '删除文件错误'});
      //     }
      //   });
      //   var oldfilename1 = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldfilename1, function (unlinkError) {
      //     if (unlinkError) {
      //       reject({message: '图片删除错误'});
      //     } else {
      //       resolve();
      //     }
      //   });
      // } else {
      //   resolve();
      // }
    });
  }
};
/**
 * Delete an dj_MemberRelationOut
 */
exports.delete = function (req, res) {
  var dj_MemberRelationOut = req.model;

  dj_MemberRelationOut.destroy().then(function () {
    res.json(dj_MemberRelationOut);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of dj_MemberRelationOut
 */
exports.list = function (req, res) {
  var dj_MemberRelationOut = sequelize.model('dj_MemberRelationOut');

  dj_MemberRelationOut.findAll({
    order: 'createDate DESC'
  }).then(function (dj_MemberRelationOut) {
    return res.jsonp(dj_MemberRelationOut);
  }).catch(function (err) {
    logger.error('dj_MemberRelationOut list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * dj_MemberRelationOut middleware
 */
exports.dj_MemberRelationOutByID = function (req, res, next, id) {
  var dj_MemberRelationOut = sequelize.model('dj_MemberRelationOut');
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  var type = req.query.type;//所属党支部ID
  if (offset !== 0 && id === '0') {
    listByPage(req, res, limit, offset, type);
  } else if (limit === 0 && offset === 0 && id === '0') {
    listCount(req, res, type);
  } else if (id !== '0') {
    dj_MemberRelationOut.findOne({
      where: {shipId: id}
    }).then(function (dj_MemberRelationOut) {
      if (!dj_MemberRelationOut) {
        logger.error('No dj_MemberRelationOut with that identifier has been found');
        return res.status(404).send({
          message: 'No dj_MemberRelationOut with that identifier has been found'
        });
      }

      req.model = dj_MemberRelationOut;
      next();
    }).catch(function (err) {
      //return next(err);
      logger.error('dj_MemberRelationOut ByID error:', err);
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  }
};
//----分页
function listByPage(req, res, limit, offset, type) {
  type = type + '';
  var sql = ' select z.* from ( select p.*, rownum rnum from ' +
    ' (select row_number() over(order by createDate desc) as rownum, ' +
    ' * from dj_MemberRelationOut where outBranch = \'' + type + '\') as p where rownum <= ' + offset + ')as z ' +
    ' where rnum > ' + limit;
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('dj_MemberRelationOut list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数
function listCount(req, res, type) {
  var sql = 'select count(*) sum from dj_MemberRelationOut where outBranch = \'' + type + '\'';
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}
