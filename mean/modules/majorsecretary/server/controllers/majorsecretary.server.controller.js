'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename),
  _ = require('lodash'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  multer = require(path.resolve('./config/private/multer')),
  util = require('util'),
  child_process = require('child_process');
//创建接收图片的对象
var saveDir = 'majorsecretary';
var diskDir1 = path.resolve(config.uploads.rootDiskDir, saveDir);
var mountDir1 = path.join(config.uploads.rootMountDir, saveDir).replace(/\\/g, '/');
//创建接收头像对象
var uploadImage = new multer(saveDir,
  100 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an majorsecretary
 */
exports.create = function (req, res) {
  var User = sequelize.model('User');
  var Majorsecretary = sequelize.model('Majorsecretary');
  var majorsecretary = Majorsecretary.build(req.body);

  if (majorsecretary) {
    uploadImage.recv(req, res, [{name: 'photo'}, {name: 'video_file'}])
      .then(updateTeammembersPic)
      .then(function () {
        res.json(majorsecretary);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'AssignedTable is not exist'
    });
  }
  function updateTeammembersPic(files) {
    return new Promise(function (resolve, reject) {
      if (majorsecretary) {
        if (files && files.photo && files.photo.length === 1) {
          majorsecretary.photo = path.join(uploadImage.mountDir, files.photo[0].filename).replace(/\\/g, '/');
        }
        /*if (files && files.video_file && files.video_file.length === 1) {
          // majorsecretary.video_file = path.join(uploadImage.mountDir, files.video_file[0].filename).replace(/\\/g, '/');
          var distFile = path.basename(files.video_file[0].filename, path.extname(files.video_file[0].filename)) + '.webm';
          var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
          majorsecretary.video_file = distFileName1;
        }*/
        majorsecretary.name = req.body.name;
        majorsecretary.sex = req.body.sex;
        majorsecretary.duty = req.body.duty;
        majorsecretary.deeds = req.body.deeds;
        majorsecretary.gradeId = req.body.gradeId;
        majorsecretary.objId = req.body.objId;
        majorsecretary.createdate = new Date();
        majorsecretary.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no grid person img upload'));
      }
    });
  }
  // majorsecretary.save().then(function () {
  //   //重新加载数据，使数据含有关联表的内容
  //   return majorsecretary.reload({
  //     // include: [
  //     //   {
  //     //     model: User,
  //     //     attributes: ['displayName']
  //     //   }
  //     // ]
  //   })
  //   .then(function() {
  //     res.json(majorsecretary);
  //   });
  // }).catch(function (err) {
  //   logger.error('majorsecretary create error:', err);
  //   return res.status(422).send({
  //     message: errorHandler.getErrorMessage(err)
  //   });
  // });
};

/**
 * Show the current majorsecretary
 */
exports.read = function (req, res) {
  var majorsecretary = req.model ? req.model.toJSON() : {};

  //majorsecretary.isCurrentUserOwner = !!(req.user && majorsecretary.user && majorsecretary.user._id.toString() === req.user._id.toString());
  majorsecretary.isCurrentUserOwner = !!(req.user && majorsecretary.user && majorsecretary.user.id.toString() === req.user.id.toString());

  res.json(majorsecretary);
};

/**
 * Update an majorsecretary
 */
exports.update = function (req, res) {
  var majorsecretary = req.model;
  var existingImageUrl;
  var newingImageUrl;
  if (majorsecretary) {
    existingImageUrl = majorsecretary.photo;
    // existingFileUrl = majorsecretary.file_path;
    uploadImage.recv(req, res, [
      {name: 'photo'}
    ])
      .then(updateTeammembersPic)
      .then(deleteOldImage)
      .then(function () {
        res.json(majorsecretary);
      })
      .catch(function (err) {
        logger.error('recv upload majorsecretary picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'majorsecretary is not exist'
    });
  }
  function updateTeammembersPic(files) {
    return new Promise(function (resolve, reject) {
      if (majorsecretary) {
        if (files && files.photo && files.photo.length === 1) {
          majorsecretary.photo = path.join(uploadImage.mountDir, files.photo[0].filename).replace(/\\/g, '/');
        }
        /*if (files && files.video_file && files.video_file.length === 1) {
          majorsecretary.video_file = path.join(uploadImage.mountDir, files.video_file[0].filename).replace(/\\/g, '/');
        }*/
        majorsecretary.name = req.body.name;
        majorsecretary.sex = req.body.sex;
        majorsecretary.duty = req.body.duty;
        majorsecretary.deeds = req.body.deeds;
        majorsecretary.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no grid person img upload'));
      }
    });
  }
  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
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
    });
  }
  // majorsecretary.name = req.body.name;
  // majorsecretary.sex = req.body.sex;
  // majorsecretary.duty = req.body.duty;

  // majorsecretary.save().then(function () {
  //   res.json(majorsecretary);
  // }).catch(function (err) {
  //   return res.status(422).send({
  //     message: errorHandler.getErrorMessage(err)
  //   });
  // });
};

/**
 * Delete an majorsecretary
 */
exports.delete = function (req, res) {
  var majorsecretary = req.model;

  majorsecretary.destroy().then(function () {
    res.json(majorsecretary);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Majorsecretary
 */
exports.list = function (req, res) {
  var Majorsecretary = sequelize.model('Majorsecretary');
  var User = sequelize.model('User');
  var objId = req.query.objId;
  var gradeId = req.query.gradeId;
  Majorsecretary.findAll({
    where: {
      gradeId: gradeId,
      objId: objId
    },
    order: 'id desc'
  }).then(function (majorsecretary) {
    return res.jsonp(majorsecretary);
  }).catch(function (err) {
    logger.error('majorsecretary list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Majorsecretary middleware
 */
exports.majorsecretaryByID = function (req, res, next, id) {
  var Majorsecretary = sequelize.model('Majorsecretary');
  var User = sequelize.model('User');

  Majorsecretary.findOne({
    where: {id: id}
    // include: [
    //   {
    //     model: User,
    //     attributes: ['displayName']
    //   }
    // ]
  }).then(function (majorsecretary) {
    if (!majorsecretary) {
      logger.error('No majorsecretary with that identifier has been found');
      return res.status(404).send({
        message: 'No majorsecretary with that identifier has been found'
      });
    }

    req.model = majorsecretary;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('majorsecretary ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
