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
var saveDir = 'teammembers';
//创建接收头像对象
var uploadImage = new multer(saveDir,
  10 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an teammembers
 */
exports.create = function (req, res) {

  var Teammembers = sequelize.model('Teammembers');
  var teammembers = Teammembers.build(req.body);

  // teammembers.save().then(function () {
  //   //重新加载数据，使数据含有关联表的内容
  //   return teammembers.reload({
  //     // include: [
  //     //   {
  //     //     model: User,
  //     //     attributes: ['displayName']
  //     //   }
  //     // ]
  //   })
  //   .then(function() {
  //     res.json(teammembers);
  //   });
  // }).catch(function (err) {
  //   logger.error('teammembers create error:', err);
  //   return res.status(422).send({
  //     message: errorHandler.getErrorMessage(err)
  //   });
  // });
  if (teammembers) {
    uploadImage.recv(req, res, [{name: 'photo'}])
      .then(updateTeammembersPic)
      .then(function () {
        res.json(teammembers);
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
      if (teammembers) {
        if (files && files.photo && files.photo.length === 1) {
          teammembers.photo = path.join(uploadImage.mountDir, files.photo[0].filename).replace(/\\/g, '/');
        }
        teammembers.name = req.body.name;
        teammembers.sex = req.body.sex;
        teammembers.duty = req.body.duty;
        teammembers.gradeId = req.body.gradeId;
        teammembers.objId = req.body.objId;
        teammembers.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no grid person img upload'));
      }
    });
  }
};

/**
 * Show the current teammembers
 */
exports.read = function (req, res) {
  var teammembers = req.model ? req.model.toJSON() : {};

  //teammembers.isCurrentUserOwner = !!(req.user && teammembers.user && teammembers.user._id.toString() === req.user._id.toString());
  teammembers.isCurrentUserOwner = !!(req.user && teammembers.user && teammembers.user.id.toString() === req.user.id.toString());

  res.json(teammembers);
};

/**
 * Update an teammembers
 */

exports.update = function (req, res) {
  var teammembers = req.model;
  var existingImageUrl;
  var newingImageUrl;
  // teammembers.name = req.body.name;
  // teammembers.sex = req.body.sex;
  // teammembers.duty = req.body.duty;

  // teammembers.save().then(function () {
  //   res.json(teammembers);
  // }).catch(function (err) {
  //   return res.status(422).send({
  //     message: errorHandler.getErrorMessage(err)
  //   });
  // });
  if (teammembers) {
    existingImageUrl = teammembers.photo;
    // existingFileUrl = teammembers.file_path;
    uploadImage.recv(req, res, [
      {name: 'photo'}
    ])
      .then(updateTeammembersPic)
      .then(deleteOldImage)
      .then(function () {
        res.json(teammembers);
      })
      .catch(function (err) {
        logger.error('recv upload teammembers picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'teammembers is not exist'
    });
  }
  function updateTeammembersPic(files) {
    return new Promise(function (resolve, reject) {
      if (teammembers) {
        if (files && files.photo && files.photo.length === 1) {
          teammembers.photo = path.join(uploadImage.mountDir, files.photo[0].filename).replace(/\\/g, '/');
        }
        teammembers.name = req.body.name;
        teammembers.sex = req.body.sex;
        teammembers.duty = req.body.duty;
        teammembers.save().then(function () {
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
};

/**
 * Delete an teammembers
 */
exports.delete = function (req, res) {
  var teammembers = req.model;

  teammembers.destroy().then(function () {
    res.json(teammembers);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Teammembers
 */
exports.list = function (req, res) {
  var Teammembers = sequelize.model('Teammembers');
  var User = sequelize.model('User');
  var gradeId = req.query.gradeId;
  var objId = req.query.objId;
  Teammembers.findAll({
    where: {
      gradeId: gradeId,
      objId: objId
    }
  }).then(function (teammembers) {
    return res.jsonp(teammembers);
  }).catch(function (err) {
    logger.error('teammembers list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Teammembers middleware
 */
exports.teammembersByID = function (req, res, next, id) {
  var Teammembers = sequelize.model('Teammembers');
  var User = sequelize.model('User');

  Teammembers.findOne({
    where: {id: id}
    // include: [
    //   {
    //     model: User,
    //     attributes: ['displayName']
    //   }
    // ]
  }).then(function (teammembers) {
    if (!teammembers) {
      logger.error('No teammembers with that identifier has been found');
      return res.status(404).send({
        message: 'No teammembers with that identifier has been found'
      });
    }

    req.model = teammembers;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('teammembers ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
