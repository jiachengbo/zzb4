'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an lianhuwang
 */
exports.create = function (req, res) {
  var User = sequelize.model('User');
  var Lianhuwang = sequelize.model('Lianhuwang');
  var lianhuwang = Lianhuwang.build(req.body);

  lianhuwang.user_id = req.user.id;
  lianhuwang.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return lianhuwang.reload({
      include: [
        {
          model: User,
          attributes: ['displayName']
        }
      ]
    })
    .then(function() {
      res.json(lianhuwang);
    });
  }).catch(function (err) {
    logger.error('lianhuwang create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current lianhuwang
 */
exports.read = function (req, res) {
  var lianhuwang = req.model ? req.model.toJSON() : {};

  //lianhuwang.isCurrentUserOwner = !!(req.user && lianhuwang.user && lianhuwang.user._id.toString() === req.user._id.toString());
  lianhuwang.isCurrentUserOwner = !!(req.user && lianhuwang.user && lianhuwang.user.id.toString() === req.user.id.toString());

  res.json(lianhuwang);
};

/**
 * Update an lianhuwang
 */
exports.update = function (req, res) {
  var lianhuwang = req.model;

  lianhuwang.title = req.body.title;
  lianhuwang.content = req.body.content;

  lianhuwang.save().then(function () {
    res.json(lianhuwang);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an lianhuwang
 */
exports.delete = function (req, res) {
  var lianhuwang = req.model;

  lianhuwang.destroy().then(function () {
    res.json(lianhuwang);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Lianhuwang
 */
exports.list = function (req, res) {
  var Lianhuwang = sequelize.model('Lianhuwang');
  var User = sequelize.model('User');

  Lianhuwang.findAll({
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ],
    order: 'id ASC'
  }).then(function (lianhuwang) {
    return res.jsonp(lianhuwang);
  }).catch(function (err) {
    logger.error('lianhuwang list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Lianhuwang middleware
 */
exports.lianhuwangByID = function (req, res, next, id) {
  var Lianhuwang = sequelize.model('Lianhuwang');
  var User = sequelize.model('User');

  Lianhuwang.findOne({
    where: {id: id},
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]
  }).then(function (lianhuwang) {
    if (!lianhuwang) {
      logger.error('No lianhuwang with that identifier has been found');
      return res.status(404).send({
        message: 'No lianhuwang with that identifier has been found'
      });
    }

    req.model = lianhuwang;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('lianhuwang ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
