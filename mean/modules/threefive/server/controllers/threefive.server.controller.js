'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an threefive
 */
exports.create = function (req, res) {
  var Threefive = sequelize.model('Threefive');
  var community = sequelize.model('community');
  var threefive = Threefive.build(req.body);
  threefive.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return threefive.reload(/*{
      include: [
        {
          model: community,
          attributes: ['communityName']
        }
      ]
    }*/)
    .then(function() {
      res.json(threefive);
    });
  }).catch(function (err) {
    logger.error('threefive create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current threefive
 */
exports.read = function (req, res) {
  var threefive = req.model ? req.model.toJSON() : {};

  //threefive.isCurrentUserOwner = !!(req.user && threefive.user && threefive.user._id.toString() === req.user._id.toString());
  threefive.isCurrentUserOwner = !!(req.user && threefive.user && threefive.user.id.toString() === req.user.id.toString());

  res.json(threefive);
};

/**
 * Update an threefive
 */
exports.update = function (req, res) {
  var threefive = req.model;
  threefive.streetid = req.body.streetid;
  threefive.communityid = req.body.communityid;
  threefive.gridId = req.body.gridId;
  threefive.gridGleader = req.body.gridGleader;
  threefive.GleaderPhone = req.body.GleaderPhone;
  threefive.PInstructor = req.body.PInstructor;
  threefive.InstructorPhone = req.body.InstructorPhone;
  threefive.peerAdvisor = req.body.peerAdvisor;
  threefive.gridZhang = req.body.gridZhang;
  threefive.centerLeader = req.body.centerLeader;
  threefive.partyBuild = req.body.partyBuild;
  threefive.EconomicZY = req.body.EconomicZY;
  threefive.publicZY = req.body.publicZY;
  threefive.socialStabilitycZY = req.body.socialStabilitycZY;
  threefive.cityZY = req.body.cityZY;
  threefive.lat = req.body.lat;
  threefive.lon = req.body.lon;
  threefive.remark = req.body.remark;
  threefive.save().then(function () {
    res.json(threefive);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an threefive
 */
exports.delete = function (req, res) {
  var threefive = req.model;

  threefive.destroy().then(function () {
    res.json(threefive);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Threefive
 */
exports.list = function (req, res) {
  var Threefive = sequelize.model('Threefive');
  var community = sequelize.model('community');
  var count = req.query.count;
  var communityid = req.query.communityid;
  var street = req.query.street;
  var limit = req.query.limit;
  var offset = req.query.offset;
  var obj;
  var obj1;
  function get(obj) {
    Threefive.findAll(obj).then(function (threefive) {
      return res.jsonp(threefive);
    }).catch(function (err) {
      logger.error('threefive list error:', err);
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
    get(obj);
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
    get(obj1);
  }
};

/**
 * Threefive middleware
 */
exports.threefiveByID = function (req, res, next, id) {
  var Threefive = sequelize.model('Threefive');
  Threefive.findOne({
    where: {id: id}/*,
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]*/
  }).then(function (threefive) {
    if (!threefive) {
      logger.error('No threefive with that identifier has been found');
      return res.status(404).send({
        message: 'No threefive with that identifier has been found'
      });
    }
    req.model = threefive;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('threefive ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
