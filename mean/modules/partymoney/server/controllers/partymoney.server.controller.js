'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an partymoney
 */
exports.create = function (req, res) {
  var User = sequelize.model('User');
  var Partymoney = sequelize.model('Partymoney');
  var partymoney = Partymoney.build(req.body);

  partymoney.user_id = req.user.id;
  partymoney.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return partymoney.reload({
      include: [
        {
          model: User,
          attributes: ['displayName']
        }
      ]
    })
      .then(function() {
        res.json(partymoney);
      });
  }).catch(function (err) {
    logger.error('partymoney create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current partymoney
 */
exports.read = function (req, res) {
  var partymoney = req.model ? req.model.toJSON() : {};

  //partymoney.isCurrentUserOwner = !!(req.user && partymoney.user && partymoney.user._id.toString() === req.user._id.toString());
  partymoney.isCurrentUserOwner = !!(req.user && partymoney.user && partymoney.user.id.toString() === req.user.id.toString());

  res.json(partymoney);
};

/**
 * Update an partymoney
 */
exports.update = function (req, res) {
  var partymoney = req.model;

  partymoney.title = req.body.title;
  partymoney.content = req.body.content;

  partymoney.save().then(function () {
    res.json(partymoney);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an partymoney
 */
exports.delete = function (req, res) {
  var partymoney = req.model;

  partymoney.destroy().then(function () {
    res.json(partymoney);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Partymoney
 */
exports.list = function (req, res) {
  var Partymoney = sequelize.model('Partymoney');
  var User = sequelize.model('User');

  Partymoney.findAll({
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ],
    order: 'id ASC'
  }).then(function (partymoney) {
    return res.jsonp(partymoney);
  }).catch(function (err) {
    logger.error('partymoney list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Partymoney middleware
 */
exports.partymoneyByID = function (req, res, next, id) {
  var Partymoney = sequelize.model('Partymoney');
  var User = sequelize.model('User');

  Partymoney.findOne({
    where: {id: id},
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]
  }).then(function (partymoney) {
    if (!partymoney) {
      logger.error('No partymoney with that identifier has been found');
      return res.status(404).send({
        message: 'No partymoney with that identifier has been found'
      });
    }

    req.model = partymoney;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('partymoney ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
