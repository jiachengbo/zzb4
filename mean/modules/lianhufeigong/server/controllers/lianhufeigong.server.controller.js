'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an lianhufeigong
 */
exports.create = function (req, res) {
  var User = sequelize.model('User');
  var Lianhufeigong = sequelize.model('Lianhufeigong');
  var lianhufeigong = Lianhufeigong.build(req.body);

  lianhufeigong.user_id = req.user.id;
  lianhufeigong.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return lianhufeigong.reload({
      include: [
        {
          model: User,
          attributes: ['displayName']
        }
      ]
    })
    .then(function() {
      res.json(lianhufeigong);
    });
  }).catch(function (err) {
    logger.error('lianhufeigong create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current lianhufeigong
 */
exports.read = function (req, res) {
  var lianhufeigong = req.model ? req.model.toJSON() : {};

  //lianhufeigong.isCurrentUserOwner = !!(req.user && lianhufeigong.user && lianhufeigong.user._id.toString() === req.user._id.toString());
  lianhufeigong.isCurrentUserOwner = !!(req.user && lianhufeigong.user && lianhufeigong.user.id.toString() === req.user.id.toString());

  res.json(lianhufeigong);
};

/**
 * Update an lianhufeigong
 */
exports.update = function (req, res) {
  var lianhufeigong = req.model;

  lianhufeigong.title = req.body.title;
  lianhufeigong.content = req.body.content;

  lianhufeigong.save().then(function () {
    res.json(lianhufeigong);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an lianhufeigong
 */
exports.delete = function (req, res) {
  var lianhufeigong = req.model;

  lianhufeigong.destroy().then(function () {
    res.json(lianhufeigong);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Lianhufeigong
 */
exports.list = function (req, res) {
  var Lianhufeigong = sequelize.model('Lianhufeigong');
  var User = sequelize.model('User');

  Lianhufeigong.findAll({
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ],
    order: 'id ASC'
  }).then(function (lianhufeigong) {
    return res.jsonp(lianhufeigong);
  }).catch(function (err) {
    logger.error('lianhufeigong list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Lianhufeigong middleware
 */
exports.lianhufeigongByID = function (req, res, next, id) {
  var Lianhufeigong = sequelize.model('Lianhufeigong');
  var User = sequelize.model('User');

  Lianhufeigong.findOne({
    where: {id: id},
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]
  }).then(function (lianhufeigong) {
    if (!lianhufeigong) {
      logger.error('No lianhufeigong with that identifier has been found');
      return res.status(404).send({
        message: 'No lianhufeigong with that identifier has been found'
      });
    }

    req.model = lianhufeigong;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('lianhufeigong ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
