'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  validator = require('validator'),
  multer = require(path.resolve('./config/private/multer')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  //usersConfig = require(path.resolve('./modules/users/server/config/users.server.config')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

//创建接收头像对象
var uploadImage = new multer(config.uploads.profile.indir,
  config.uploads.profile.limitFileSize,
  /image/, '.jpg');
//创建目录
//uploadImage.mkPaths();

var User = sequelize.model('User');
var whitelistedFields = ['firstName', 'lastName', 'email', 'username'];

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;
  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user.updatedAt = Date.now();
    user.displayName = User.genDisplayName(user.firstName, user.lastName);

    user.save().then(function () {
      req.login(user, function (err) {
        if (err) {
          logger.error('profile update user login error:', err);
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }).catch(function (err) {
      logger.error('profile update user save error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};
/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var existingImageUrl;

  // Filtering to upload only images
  //var multerConfig = {dest: usersConfig.diskDir, limit: config.uploads.profile.image.limits};
  //multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  //var upload = multer(usersConfig.multerConfig).single('newProfilePicture');
  //在配置文件中生成的文件接收对象
  //var uploadImage = usersConfig.uploadImage;

  if (user) {
    existingImageUrl = user.profileImageURL;
    uploadImage.recv(req, res, [{ name: 'newProfilePicture'}])
      .then(updateUser)
      .then(deleteOldImage)
      .then(login)
      .then(function () {
        res.json(user);
      })
      .catch(function (err) {
        logger.error('recv upload profile picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
/*
  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }
*/
  function updateUser(files) {
    return new Promise(function (resolve, reject) {
      if (files && files.newProfilePicture && files.newProfilePicture.length === 1) {
        user.profileImageURL = path.join(uploadImage.mountDir,
          files.newProfilePicture[0].filename).replace(/\\/g, '/');

        user.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no file upload'));
      }
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== user.getProfileImageDefault()) {
        var oldfilename = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename, function (unlinkError) {
          if (unlinkError) {
            logger.warn('Error occurred while deleting old profile picture');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  function login() {
    return new Promise(function (resolve, reject) {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      id: req.user.id,
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      createdAt: req.user.createdAt.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.json(safeUserObject || null);
};
