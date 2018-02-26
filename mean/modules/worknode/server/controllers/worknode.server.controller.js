'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  config = require(path.resolve('./config/config')),
  util = require('util'),
  child_process = require('child_process'),
  socketsCtrl = require(path.resolve('./modules/global/server/controllers/wordhtml.js')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);
//创建项目进展对象
var saveDir = 'worknode';
// var diskDir1 = path.resolve(config.uploads.rootDiskDir, saveDir);
// var mountDir1 = path.join(config.uploads.rootMountDir, saveDir).replace(/\\/g, '/');
// //目标文件类型
// var distType = 'html';
// //不同类型参数
// var typeParam = {
//   //html 字符集utf-8
//   html: ':XHTML Writer File:UTF8'
// };
var uploadImage = new multer(saveDir,
  2 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an userreport
 */
exports.create = function (req, res) {
  var User = sequelize.model('User');
  var userReport = sequelize.model('userReport');
  var userreport = userReport.build(req.body);

  userreport.userReportContext = req.body.userReportContext;
  userreport.createDate = new Date();
  userreport.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return userreport.reload({
      // include: [
      //   {
      //     model: User,
      //     attributes: ['displayName']
      //   }
      // ]
    })
    .then(function() {
      res.json(userreport);
    });
  }).catch(function (err) {
    logger.error('userreport create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current userreport
 */
exports.read = function (req, res) {
  var userreport = req.model ? req.model.toJSON() : {};

  //userreport.isCurrentUserOwner = !!(req.user && userreport.user && userreport.user._id.toString() === req.user._id.toString());
  userreport.isCurrentUserOwner = !!(req.user && userreport.user && userreport.user.id.toString() === req.user.id.toString());

  res.json(userreport);
};

/**
 * Update an userreport
 */
exports.update = function (req, res) {
  // var userReport = sequelize.model('userReport');
  // var userreport = userReport.build(req.body);
  var userreport;
  var userReport;
  var existingImageUrl;
  var existingFileUrl;
  var existingImagejpg;
  var newingFileUrl;
  var newingImageUrl;
  if (req.model) {
    userreport = req.model;
  } else {
    userReport = sequelize.model('userReport');
    userreport = userReport.build(req.body);
    userreport.createDate = new Date();
  }
  if (userreport) {
    existingImageUrl = userreport.imagePath;
    existingFileUrl = userreport.file_path;
    uploadImage.recv(req, res, [
      {name: 'imagePath'}
    ])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(userreport);
      })
      .catch(function (err) {
        logger.error('recv upload userreport picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'userreport is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      console.log(req.body);
      if (userreport) {
        if (files && files.imagePath && files.imagePath.length === 1) {
          userreport.imagePath = path.join(uploadImage.mountDir, files.imagePath[0].filename).replace(/\\/g, '/');
          newingImageUrl = userreport.imagePath;
        }
        // if (files && files.file_path && files.file_path.length === 1) {
        //   userreport.file_path = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
        //   existingImagejpg = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/');
        //   newingFileUrl = userreport.file_path;
        //   socketsCtrl.get(files.file_path[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        // }
        userreport.userReportContext = req.body.userReportContext;
        userreport.streetid = req.body.streetid;
        userreport.communityid = req.body.communityid;
        userreport.gridId = req.body.gridId;
        //图片
        // if (files && files.file_path && files.file_path.length === 1) {
        //   existingImagejpg = path.join(mountDir1, files.file_path[0].filename).replace(/\\/g, '/');
        //   var diskFileName = path.join(diskDir1, files.file_path[0].filename);
        //   fs.exists(diskFileName, function (exists) {
        //     if (!exists) {
        //       logger.warn('conv docfile %s not exists', diskFileName);
        //       return res.status(404).send('参数文件不存在:' + diskFileName);
        //     }
        //     var type = distType + (typeParam[distType] ? typeParam[distType] : '');
        //     var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
        //       config.sofficePathName, type, diskDir1, diskFileName);
        //     child_process.exec(cmdLine, function (error, stdout, stderr) {
        //       if (error) {
        //         logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
        //         return res.status(404).send('文件转换错误:' + diskFileName);
        //       }
        //
        //       var distFile = path.basename(files.file_path[0].filename, path.extname(files.file_path[0].filename)) + '.' + distType;
        //       var distFileName = path.join(diskDir1, distFile);
        //       // aaa = distFileName.replace(/\\/g, '/');
        //       fs.exists(distFileName, function (exists) {
        //         if (!exists) {
        //           return res.status(404).send('转换后的文件不存在:' + distFileName);
        //         }
        //         var options = {};
        //         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
        //         newingFileUrl = distFileName1;
        //         userreport.save().then(function () {
        //           return userreport.reload()
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
        if (!(files && files.file_path && files.file_path.length === 1)) {
          userreport.save().then(function () {
            return userreport.reload()
              .then(function () {
                resolve();
              });
          }).catch(function (err) {
            reject(err);
          });
        }
      } else {
        reject(new Error('no userreport img upload'));
      }
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      // if (existingImagejpg) {
      //   var oldjpg = existingImagejpg.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldjpg, function (unlinkError) {
      //     if (unlinkError) {
      //       reject({message: 'jpg文件删除错误'});
      //     }
      //   });
      // }
      if (existingImageUrl && newingImageUrl) {
        var oldfilename = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename, function (unlinkError) {
          if (unlinkError) {
            // resolve();
            /**/
            reject({
              message: '图片删除错误'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
      // if (existingFileUrl && newingFileUrl) {
      //   var oldfile = existingFileUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldfile, function (unlinkError) {
      //     if (unlinkError) {
      //       reject({message: '删除文件错误'});
      //     } else {
      //       resolve();
      //     }
      //   });
      // } else {
      //   resolve();
      // }
      // if (existingImageUrl && newingImageUrl && existingFileUrl && newingFileUrl) {
      //   var oldfile1 = existingFileUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
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
 * Delete an userreport
 */
exports.delete = function (req, res) {
  var userreport = req.model;

  userreport.destroy().then(function () {
    res.json(userreport);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of userReport
 */
exports.list = function (req, res) {
  var userReport = sequelize.model('userReport');
  var community = sequelize.model('community');
  var count = req.query.count;
  var communityid = req.query.communityid;
  var street = req.query.street;
  var limit = req.query.limit;
  var offset = req.query.offset;
  var obj;
  var obj1;
  function get(obj) {
    userReport.findAll(obj).then(function (userreport) {
      return res.jsonp(userreport);
    }).catch(function (err) {
      logger.error('userreport list error:', err);
      return res.status(422).send(err);
    });
  }
  if (count) {
    if (!communityid && street) {
      obj = {
        where: {
          streetid: street
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('userReportId')), 'shuliang']]
      };
    } else if (street && communityid) {
      obj = {
        where: {
          communityid: communityid,
          streetid: street
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('userReportId')), 'shuliang']]
      };
    } else {
      obj = {
        attributes: [[sequelize.fn('COUNT', sequelize.col('userReportId')), 'shuliang']]
      };
    }
    get(obj);
  } else {
    if (!communityid && street) {
      obj1 = {
        where: {
          streetid: street
        },
        limit: limit,
        offset: offset,
        order: 'userReportId Asc'
      };
    } else if (street && communityid) {
      obj1 = {
        where: {
          communityid: communityid,
          streetid: street
        },
        limit: limit,
        offset: offset,
        order: 'userReportId Asc'
      };
    } else {
      obj1 = {
        limit: limit,
        offset: offset,
        order: 'userReportId Asc'
      };
    }
    get(obj1);
  }
};

/**
 * userReport middleware
 */
exports.worknodeByID = function (req, res, next, id) {
  var userReport = sequelize.model('userReport');
  //var User = sequelize.model('User');

  userReport.findOne({
    where: {userReportId: id}
    // include: [
    //   {
    //     model: User,
    //     attributes: ['displayName']
    //   }
    // ]
  }).then(function (userreport) {
    if (!userreport) {
      logger.error('No userreport with that identifier has been found');
      return res.status(404).send({
        message: 'No userreport with that identifier has been found'
      });
    }

    req.model = userreport;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('userreport ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
