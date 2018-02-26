'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

var Department = sequelize.model('Department');

/**
 * Create an department
 */
exports.create = function (req, res) {
  var department = Department.build(req.body);

  department.save().then(function () {
    res.json(department);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current department
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a department
 */
exports.update = function (req, res) {
  var department = req.model;

  department = Object.assign(department, req.body);
/*
  // For security purposes only merge these parameters
  department.name = req.body.name;
  department.displayName = req.body.displayName;
  department.parentId = req.body.parentId;
*/
  department.save().then(function () {
    res.json(department);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete a department
 */
exports.delete = function (req, res) {
  // 删除单个实例
  var department = req.model;
//  department.destroy()
  //删除组及组内的组
  Department.destroy({where: {$or: [
    { id: department.id },
    { parentId: department.id }
  ]}})
  .then(function () {
    res.json(department);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of department
 */
exports.list = function (req, res) {
  Department.findAll({
    order: 'id ASC'
  }).then(function (departments) {
    res.json(departments);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * User middleware
 */
exports.departmentByID = function (req, res, next, id) {
  Department.findOne({
    where: {id: id}
  }).then(function (department) {
    if (!department) {
      return next(new Error('Failed to load department ' + id));
    }
    req.model = department;
    next();
  }).catch(function (err) {
    return next(err);
  });
};
