'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an problem
 */
exports.create = function (req, res) {
  var street_info = sequelize.model('street_info');
  var Problem = sequelize.model('ProblemTable');
  var problem = Problem.build(req.body);
  problem.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return problem.reload({
      include: [
        {
          model: street_info,
          attributes: ['streetName']
        }
      ]
    })
      .then(function () {
        res.json(problem);
      });
  }).catch(function (err) {
    logger.error('problem create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current problem
 */
exports.read = function (req, res) {
  var problem = req.model ? req.model.toJSON() : {};

  //problem.isCurrentUserOwner = !!(req.user && problem.user && problem.user._id.toString() === req.user._id.toString());
  problem.isCurrentUserOwner = !!(req.user && problem.user && problem.user.id.toString() === req.user.id.toString());

  res.json(problem);
};

/**
 * Update an problem
 */
exports.update = function (req, res) {
  var problem = req.model;

  problem.title = req.body.title;
  problem.photo = req.body.photo;
  problem.adviceContent = req.body.adviceContent;
  problem.createDate = req.body.createDate;
  problem.modifyUserId = req.body.modifyUserId;
  problem.releasePerson = req.body.releasePerson;
  problem.replyTime = new Date();
  problem.replyTime = problem.replyTime.toLocaleString();
  problem.replyContent = req.body.replyContent;
  problem.issend = req.body.issend;
  problem.streetID = req.body.streetID;
  problem.communityID = req.body.communityID;
  problem.gridID = req.body.gridID;

  problem.save().then(function () {
    res.json(problem);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an problem
 */
exports.delete = function (req, res) {
  var problem = req.model;

  problem.destroy().then(function () {
    res.json(problem);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Problem
 */
exports.list = function (req, res) {
  var Problem = sequelize.model('ProblemTable');
  var street_info = sequelize.model('street_info');
  var issum = req.query.issum;
  var offset = req.query.offset;
  var limit = req.query.limit;
  var streetID = req.query.streetID;
  var communityID = req.query.communityID;
  var gridID = req.query.gridID;
  var where;
  if (streetID) {
    where = {
      streetID: streetID
    };
  }
  if (communityID) {
    where = {
      $or: [
        {streetID: streetID, communityID: communityID, istype: 0},
        {streetID: streetID, communityID: communityID, istype: 1}
      ]
    };
  }
  if (gridID) {
    where = {
      streetID: streetID,
      communityID: communityID,
      gridID: gridID
    };
  }
  if (issum === '1') {
    Problem.findAll({
      where: where,
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']]
    }).then(function (advice) {
      return res.jsonp(advice);
    }).catch(function (err) {
      logger.error('advice list error:', err);
      return res.status(422).send(err);
    });
  } else {
    Problem.findAll({
      where: where,
      include: [
        {
          model: street_info,
          attributes: ['streetName']
        }
      ],
      offset: offset,
      limit: limit,
      order: 'id ASC'
    }).then(function (advice) {
      return res.jsonp(advice);
    }).catch(function (err) {
      logger.error('advice list error:', err);
      return res.status(422).send(err);
    });
  }
};

/**
 * Problem middleware
 */
exports.problemByID = function (req, res, next, id) {
  var Problem = sequelize.model('ProblemTable');
  var street_info = sequelize.model('street_info');

  Problem.findOne({
    where: {id: id},
    include: [
      {
        model: street_info,
        attributes: ['streetName']
      }
    ]
  }).then(function (problem) {
    if (!problem) {
      logger.error('No problem with that identifier has been found');
      return res.status(404).send({
        message: 'No problem with that identifier has been found'
      });
    }

    req.model = problem;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('problem ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
