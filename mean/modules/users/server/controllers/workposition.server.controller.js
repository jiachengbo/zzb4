'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

var Department = sequelize.model('Department');
var Role = sequelize.model('Role');
var WorkPosition = sequelize.model('WorkPosition');

/**
 * Create an workposition
 */
exports.create = function (req, res) {
  var workposition = WorkPosition.build(req.body);

  workposition.save()
    .then(function () {
      //保存role关联
      if (req.body.Roles && Array.isArray(req.body.Roles)) {
        //增加返回roles字段
        workposition.set('Roles', req.body.Roles, {raw: true});
        var roles = req.body.Roles.map(function (role) {
          return Role.build(role);
        });
        return workposition.setRoles(roles);
      }
    })
    .then(function() {
      res.json(workposition);
    })
    .catch(function (err) {
      logger.error('workposition create error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Show the current workposition
 */
exports.read = function (req, res) {
  var workposition = req.model ? req.model.toJSON() : {};

  //workposition.isCurrentDepartmentOwner = !!(req.user && workposition.user && workposition.user._id.toString() === req.user._id.toString());

  res.json(workposition);
};

/**
 * Update an workposition
 */
exports.update = function (req, res) {
  var workposition = req.model;

/*
  workposition.name = req.body.name;
  workposition.displayName = req.body.displayName;
  workposition.descText = req.body.descText;
*/
  //如果使用了update(req.body),没有使用save,就不需要再调用workposition.set('Roles', req.body.Roles, {raw: true});设置新关联内容了
  workposition.update(req.body)
    .then(function () {
      if (req.body.Roles && Array.isArray(req.body.Roles)) {
        var roles = req.body.Roles.map(function (role) {
          return Role.build(role);
        });
        return workposition.setRoles(roles);
      }
    })
    .then(function () {
      res.json(workposition);
    })
    .catch(function (err) {
      logger.error('workposition update error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Delete an workposition
 */
exports.delete = function (req, res) {
  var workposition = req.model;

  workposition.destroy()
    .then(function () {
      //清除和role的关联
      return workposition.setRoles([]);
    })
    .then(function () {
      //清除和user的关联
      return workposition.setUsers([]);
    })
    .then(function () {
      res.json(workposition);
    })
    .catch(function (err) {
      logger.error('workposition delete error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List of WorkPosition
 */
exports.list = function (req, res) {
  //查询参数
  var where = {};
  if (req.query.hasOwnProperty('department_id')) {
    where = {department_id: req.query.department_id};
  }

  WorkPosition.findAll({
    where: where,
    include: [
      {
        model: Role,
        through: {
          as: 'wpr', //简短字段名，oracle限制总长不能超过30个字符
          attributes: []
        },
        attributes: ['id']
      }
    ],
    order: 'id ASC'
  }).then(function (workposition) {
    return res.jsonp(workposition);
  }).catch(function (err) {
    logger.error('workposition list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * WorkPosition middleware
 */
exports.workpositionByID = function (req, res, next, id) {
  WorkPosition.findOne({
    where: {id: id},
    include: [
      {
        model: Role,
        through: {
          as: 'wpr', //简短字段名，oracle限制总长不能超过30个字符
          attributes: []
        },
        attributes: ['id']
      }
    ]
  }).then(function (workposition) {
    if (!workposition) {
      logger.error('No workposition with that identifier has been found');
      return res.status(404).send({
        message: 'No workposition with that identifier has been found'
      });
    }

    req.model = workposition;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('workposition ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
