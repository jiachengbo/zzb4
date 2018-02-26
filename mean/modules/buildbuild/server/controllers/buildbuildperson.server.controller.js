'use strict';

/**
 * Module dependencies
 * 共驻共建 活动 图文
 */
var path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  util = require('util'),
  child_process = require('child_process'),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);


/**
 * Create an buildbuild
 */
exports.create = function (req, res) {
  var BuildbuildPerson = sequelize.model('BuildbuildPerson');
  console.log(req.query);
  var arr = [];
  BuildbuildPerson.create(req.query).then(function (data) {
    arr.push(data);
    res.json(arr);
  }).catch(function (err) {
    logger.error('BuildbuildPerson create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
  // buildbuildPerson.save().then(function () {
  //   //重新加载数据，使数据含有关联表的内容
  //   res.json(buildbuildPerson);
  // }).catch(function (err) {
  //   logger.error('partymoney create error:', err);
  //   return res.status(422).send({
  //     message: errorHandler.getErrorMessage(err)
  //   });
  // });
};

exports.change = function (req, res) {
  var id = req.query.id;
  var ishow = req.query.ishow;
  var BuildbuildPerson = sequelize.model('BuildbuildPerson');
  if (ishow === '-1') {
    var sql = 'DELETE FROM BuildbuildPerson WHERE hdId = ' + id;
    sequelize.query(sql).spread(function (results, metadata) {
      // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
      res.jsonp(results);
    }).catch(function (err) {
      logger.error('delete  error:', err);
      return res.status(422).send(err);
    });
  } else {
    BuildbuildPerson.update({
      ishow: ishow
    }, {
      where: {
        id: id
      }
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function () {

    });
  }
};
