'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an partygeneral
 */
exports.create = function (req, res) {
  var dj_PartyOrganization = sequelize.model('dj_PartyOrganization');
  var Partygeneral = sequelize.model('dj_PartyGeneralBranch');
  var partygeneral = Partygeneral.build(req.body);
  partygeneral.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return partygeneral.reload({
      include: [
        {
          model: dj_PartyOrganization,
          attributes: ['simpleName']
        }
      ]
    })
      .then(function () {
        res.json(partygeneral);
      });
  }).catch(function (err) {
    logger.error('partygeneral create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current partygeneral
 */
exports.read = function (req, res) {
  var partygeneral = req.model ? req.model.toJSON() : {};

  //partygeneral.isCurrentUserOwner = !!(req.user && partygeneral.user && partygeneral.user._id.toString() === req.user._id.toString());
  partygeneral.isCurrentUserOwner = !!(req.user && partygeneral.user && partygeneral.user.id.toString() === req.user.id.toString());

  res.json(partygeneral);
};

/**
 * Update an partygeneral
 */
exports.update = function (req, res) {
  var partygeneral = req.model;

  partygeneral.branchName = req.body.branchName;
  partygeneral.GradeID = req.body.GradeID;
  partygeneral.simpleName = req.body.simpleName;
  partygeneral.superior = req.body.superior;
  partygeneral.mold = req.body.mold;

  partygeneral.save().then(function () {
    res.json(partygeneral);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an partygeneral
 */
exports.delete = function (req, res) {
  var partygeneral = req.model;

  partygeneral.destroy().then(function () {
    res.json(partygeneral);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Partygeneral
 */
exports.list = function (req, res) {
  var Partygeneral = sequelize.model('dj_PartyGeneralBranch');
  var dj_PartyOrganization = sequelize.model('dj_PartyOrganization');
  var superior = req.query.superior;
  var grade = req.user.user_grade;
  var where;
  if (grade === 1) {
    where = {};
  } else if (grade === 4 || grade === 5) {
    where = {
      superior: superior
    };
  } else {
    where = {
      superior: null
    };
  }
  Partygeneral.findAll({
    where: where,
    include: [
      {
        model: dj_PartyOrganization,
        attributes: ['simpleName']
      }
    ],
    order: 'branchID desc'
  }).then(function (partygeneral) {
    return res.jsonp(partygeneral);
  }).catch(function (err) {
    logger.error('partygeneral list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Partygeneral middleware
 */
exports.partygeneralByID = function (req, res, next, id) {
  var Partygeneral = sequelize.model('dj_PartyGeneralBranch');
  var dj_PartyOrganization = sequelize.model('dj_PartyOrganization');
  console.log(id);
  Partygeneral.findOne({
    where: {branchID: id},
    include: [
      {
        model: dj_PartyOrganization,
        attributes: ['simpleName']
      }
    ]
  }).then(function (partygeneral) {
    if (!partygeneral) {
      logger.error('No partygeneral with that identifier has been found');
      return res.status(404).send({
        message: 'No partygeneral with that identifier has been found'
      });
    }

    req.model = partygeneral;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('partygeneral ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
