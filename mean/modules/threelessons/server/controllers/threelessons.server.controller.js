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
var saveDir = 'Threelessonsfile';
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
  10 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an threelessons
 */
exports.create = function (req, res) {
  var User = sequelize.model('User');
  var Threelessons = sequelize.model('Threelessons');
  var threelessons = Threelessons.build(req.body);

  threelessons.user_id = req.user.id;
  threelessons.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return threelessons.reload({
      // include: [
      //   {
      //     model: User,
      //     attributes: ['displayName']
      //   }
      // ]
    })
      .then(function () {
        res.json(threelessons);
      });
  }).catch(function (err) {
    logger.error('threelessons create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current threelessons
 */
exports.read = function (req, res) {
  var threelessons = req.model ? req.model.toJSON() : {};

  //threelessons.isCurrentUserOwner = !!(req.user && threelessons.user && threelessons.user._id.toString() === req.user._id.toString());
  threelessons.isCurrentUserOwner = !!(req.user && threelessons.user && threelessons.user.id.toString() === req.user.id.toString());

  res.json(threelessons);
};

/**
 * Update an threelessons
 */
// exports.update = function (req, res) {
//   var threelessons = req.model;
//
//   threelessons.title = req.body.title;
//   threelessons.content = req.body.content;
//   threelessons.starttime = req.body.starttime;
//   threelessons.endtime = req.body.endtime;
//
//   threelessons.save().then(function () {
//     res.json(threelessons);
//   }).catch(function (err) {
//     return res.status(422).send({
//       message: errorHandler.getErrorMessage(err)
//     });
//   });
// };
exports.update = function (req, res) {
  // var Threelessons = sequelize.model('Threelessons');
  // var threelessons = Threelessons.build(req.body);
  var threelessons;
  var Threelessons;
  var existingImageUrl;
  var existingFileUrl;
  var existingImagejpg;
  var newingFileUrl;
  var newingImageUrl;
  if (req.model) {
    threelessons = req.model;
  } else {
    Threelessons = sequelize.model('Threelessons');
    threelessons = Threelessons.build(req.body);
    threelessons.createdate = new Date();
  }
  if (threelessons) {
    existingImageUrl = threelessons.photo;
    existingFileUrl = threelessons.file_path;
    uploadImage.recv(req, res, [
      {name: 'photo'}, {name: 'file_path'}
    ])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(threelessons);
      })
      .catch(function (err) {
        logger.error('recv upload threelessons picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'threelessons is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      console.log(req.body);
      if (threelessons) {
        if (files && files.photo && files.photo.length === 1) {
          threelessons.photo = path.join(uploadImage.mountDir, files.photo[0].filename).replace(/\\/g, '/');
          newingImageUrl = threelessons.photo;
        }
        if (files && files.file_path && files.file_path.length === 1) {
          threelessons.file_path = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/');
          newingFileUrl = threelessons.file_path;
          socketsCtrl.get(files.file_path[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        threelessons.title = req.body.title;
        threelessons.content = req.body.content;
        threelessons.starttime = req.body.starttime;
        threelessons.endtime = req.body.endtime;
        threelessons.head = req.body.head;
        threelessons.peoplenum = req.body.peoplenum;
        threelessons.address = req.body.address;
        threelessons.gradeId = req.body.gradeId;
        threelessons.objId = req.body.objId;
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
        //         threelessons.file_path = distFileName1;
        //         threelessons.save().then(function () {
        //           return threelessons.reload()
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
        // if (!(files && files.file_path && files.file_path.length === 1)) {
        threelessons.save().then(function () {
          return threelessons.reload()
            .then(function () {
              resolve();
            });
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no threelessons img upload'));
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
 * Delete an threelessons
 */
exports.delete = function (req, res) {
  var threelessons = req.model;

  threelessons.destroy().then(function () {
    res.json(threelessons);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Threelessons
 */
exports.list = function (req, res) {
  var Threelessons = sequelize.model('Threelessons');
  var User = sequelize.model('User');
  var gradeId = req.query.gradeId;
  var objId = req.query.objId;
  Threelessons.findAll({
    where: {
      gradeId: gradeId,
      objId: objId
    },
    order: 'id ASC'
  }).then(function (threelessons) {
    return res.jsonp(threelessons);
  }).catch(function (err) {
    logger.error('threelessons list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Threelessons middleware
 */
exports.threelessonsByID = function (req, res, next, id) {
  var Threelessons = sequelize.model('Threelessons');
  var User = sequelize.model('User');

  Threelessons.findOne({
    where: {id: id}
    // include: [
    //   {
    //     model: User,
    //     attributes: ['displayName']
    //   }
    // ]
  }).then(function (threelessons) {
    if (!threelessons) {
      logger.error('No threelessons with that identifier has been found');
      return res.status(404).send({
        message: 'No threelessons with that identifier has been found'
      });
    }

    req.model = threelessons;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('threelessons ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
