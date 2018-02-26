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

var Appealsb = sequelize.model('appealsb');

/**
 * Create an appeal
 */
exports.create = function (req, res) {
  // console.info(req.query.appealsb);
  var appealsbData = JSON.parse(req.query.appealsb);
  var user = req.user;
  var issb = appealsbData.issb;
  var appealId = appealsbData.appealId;
  var gradeId = appealsbData.gradeId;
  var roleId = appealsbData.roleId;
  if (issb === 1) {
    Appealsb.findOne({
      where: {
        appealId: appealId,
        gradeId: gradeId,
        roleId: roleId
      }
    }).then(function (appealsb) {
      if (!appealsb) {
        logger.error('No appealsb with that identifier has been found');
        return res.status(404).send({
          message: 'No appealsb with that identifier has been found'
        });
      }

      appealsb.destroy().then(function () {
        return res.json(appealsb);
      }).catch(function (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      });
    }).catch(function (err) {
      logger.error('appealsb ByID error:', err);
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });

  } else {
    Appealsb.create({
      appealId: appealsbData.appealId,
      gradeId: appealsbData.gradeId,
      roleId: appealsbData.roleId,
      sbtime: new Date(),
      PartyBranchID: appealsbData.PartyBranchID,
      ishow: 0,
      issb: 0
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      res.status(422).send(err);
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
  var appealsb = req.model;
  if (appealsb) {
    appealsb.save().then(function () {
      res.json(appealsb);
    })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  }
};

/**
 * Delete an appealsb
 */
exports.delete = function (req, res) {
  var appealsb = req.model;
  appealsb.destroy().then(function () {
    res.json(appealsb);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Appeal
 */
exports.list = function (req, res) {
  var Appealsb = sequelize.model('appealsb');
  Appealsb.findAll({
    order: 'id desc'
  }).then(function (appealsb) {
    return res.jsonp(appealsb);
  }).catch(function (err) {
    logger.error('appealsb list error:', err);
    return res.status(422).send(err);
  });
};
/**
 * Appeal middleware
 */
exports.appealsbByID = function (req, res, next, id) {
  var Appealsb = sequelize.model('appealsb');
  // console.info('appealsbByID');
  // console.info(id);
  Appealsb.findOne({
    where: {id: id}
  }).then(function (appealsb) {
    if (!appealsb) {
      logger.error('No appealsb with that identifier has been found');
      return res.status(404).send({
        message: 'No appealsb with that identifier has been found'
      });
    }
    req.model = appealsb;
    next();
  }).catch(function (err) {
    logger.error('appealsb ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};
exports.createzq = function (req, res) {
  var appealsb = sequelize.model('appealsb');
  var arr = [];
  appealsb.create(req.query).then(function (data) {
    arr.push(data);
    res.json(arr);
  }).catch(function (err) {
    logger.error('appealsb create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
