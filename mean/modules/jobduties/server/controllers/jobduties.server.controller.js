'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an jobduties
 */
exports.create = function (req, res) {
  var User = sequelize.model('User');
  var Jobduties = sequelize.model('Jobduties');
  var jobduties = Jobduties.build(req.body);

  jobduties.dutycontent = req.body.dutycontent;
  jobduties.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return jobduties.reload({
      // include: [
      //   {
      //     model: User,
      //     attributes: ['displayName']
      //   }
      // ]
    })
      .then(function () {
        res.json(jobduties);
      });
  }).catch(function (err) {
    logger.error('jobduties create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current jobduties
 */
exports.read = function (req, res) {
  var jobduties = req.model ? req.model.toJSON() : {};

  //jobduties.isCurrentUserOwner = !!(req.user && jobduties.user && jobduties.user._id.toString() === req.user._id.toString());
  jobduties.isCurrentUserOwner = !!(req.user && jobduties.user && jobduties.user.id.toString() === req.user.id.toString());

  res.json(jobduties);
};

/**
 * Update an jobduties
 */
exports.update = function (req, res) {
  var jobduties = req.model;
  jobduties.dutycontent = req.body.dutycontent;
  jobduties.streetid = req.body.streetid;
  jobduties.communityid = req.body.communityid;
  jobduties.gridId = req.body.gridId;
  jobduties.save().then(function () {
    res.json(jobduties);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an jobduties
 */
exports.delete = function (req, res) {
  var jobduties = req.model;

  jobduties.destroy().then(function () {
    res.json(jobduties);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Jobduties
 */
exports.list = function (req, res) {
  var Jobduties = sequelize.model('Jobduties');
  var count = req.query.count;
  var communityid = req.query.communityid;
  var street = req.query.street;
  var limit = req.query.limit;
  var offset = req.query.offset;
  var obj;
  var obj1;
  console.log(req.query);
  // var User = sequelize.model('User');
  function counts(obj) {
    Jobduties.findAll(obj).then(function (jobduties) {
      return res.jsonp(jobduties);
    }).catch(function (err) {
      logger.error('jobduties list error:', err);
      return res.status(422).send(err);
    });
  }
  function getdata(obj1) {
    Jobduties.findAll(obj1).then(function (jobduties) {
      return res.jsonp(jobduties);
    }).catch(function (err) {
      logger.error('jobduties list error:', err);
      return res.status(422).send(err);
    });
  }
  if (count) {
    if (!communityid && street) {
      obj = {
        where: {
          streetid: street
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'shuliang']]
      };
    } else if (street && communityid) {
      obj = {
        where: {
          communityid: communityid,
          streetid: street
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'shuliang']]
      };
    } else {
      obj = {
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'shuliang']]
      };
    }
    counts(obj);
  } else {
    if (!communityid && street) {
      obj1 = {
        where: {
          streetid: street
        },
        limit: limit,
        offset: offset,
        order: 'id Asc'
      };
    } else if (street && communityid) {
      obj1 = {
        where: {
          communityid: communityid,
          streetid: street
        },
        limit: limit,
        offset: offset,
        order: 'id Asc'
      };
    } else {
      obj1 = {
        limit: limit,
        offset: offset,
        order: 'id Asc'
      };
    }
    getdata(obj1);
  }
};

/**
 * Jobduties middleware
 */
exports.jobdutiesByID = function (req, res, next, id) {
  var Jobduties = sequelize.model('Jobduties');
  // var User = sequelize.model('User');

  Jobduties.findOne({
    where: {id: id}
  }).then(function (jobduties) {
    if (!jobduties) {
      logger.error('No jobduties with that identifier has been found');
      return res.status(404).send({
        message: 'No jobduties with that identifier has been found'
      });
    }

    req.model = jobduties;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('jobduties ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
