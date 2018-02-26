'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an role
 */
exports.create = function (req, res) {
  var Role = sequelize.model('Role');
  var role = Role.build(req.body);

  role.save().then(function () {
    res.json(role);
  }).catch(function (err) {
    logger.error('role create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current role
 */
exports.read = function (req, res) {
  var role = req.model ? req.model.toJSON() : {};

  res.json(role);
};

/**
 * Update an role
 */
exports.update = function (req, res) {
  var role = req.model;

  role = Object.assign(role, req.body);
/*
  role.name = req.body.name;
  role.displayName = req.body.displayName;
  role.descText = req.body.descText;
  role.parentId = req.body.parentId;
*/
  role.save().then(function () {
    res.json(role);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an role
 */
exports.delete = function (req, res) {
  var role = req.model;

  role.destroy()
    .then(function () {
      //清除和workposition的关联
      return role.setWps([]);
    })
    .then(function () {
      res.json(role);
    }).catch(function (err) {
      logger.error('delete role error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List of Role
 */
exports.list = function (req, res) {
  var Role = sequelize.model('Role');

  Role.findAll({
    order: 'id ASC'
  }).then(function (role) {
    return res.jsonp(role);
  }).catch(function (err) {
    logger.error('role list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Role middleware
 */
exports.roleByID = function (req, res, next, id) {
  var Role = sequelize.model('Role');

  Role.findOne({
    where: {id: id}
  }).then(function (role) {
    if (!role) {
      logger.error('findone roleByID return null error');
      return res.status(404).send({
        message: 'No role with that identifier has been found'
      });
    }

    req.model = role;
    next();
  }).catch(function (err) {
    logger.error('fineone roleByID error:', err);
    return next(err);
  });
};
