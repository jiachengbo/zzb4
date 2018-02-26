'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an projectTable
 */
exports.create = function (req, res) {
  var ProjectTable = sequelize.model('ProjectTable');
  var projectTable = ProjectTable.build(req.body);

  // projectAnalysis.user_id = req.user.id;
  projectTable.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return projectTable.reload()
    .then(function() {
      res.json(projectTable);
    });
  }).catch(function (err) {
    logger.error('projectTable create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current projectTable
 */
exports.read = function (req, res) {
  var projectTable = req.model ? req.model.toJSON() : {};

  projectTable.isCurrentUserOwner = !!(req.user && projectTable.user && projectTable.user.id.toString() === req.user.id.toString());

  res.json(projectTable);
};

/**
 * Update an projectTable
 */
exports.update = function (req, res) {
  var projectTable = req.model;

  projectTable.ProjectName = req.body.ProjectName;
  projectTable.ProjectSummary = req.body.ProjectSummary;
  // projectTable.ProjectLogo = req.body.ProjectLogo;
  projectTable.ProjectRank = req.body.ProjectRank;
  projectTable.Source = req.body.Source;
  projectTable.ProjectType = req.body.ProjectType;
  projectTable.Measure = req.body.Measure;
  projectTable.People = req.body.People;
  projectTable.SbTime = req.body.SbTime;
  projectTable.FinishTime = req.body.FinishTime;
  projectTable.Head = req.body.Head;
  projectTable.State = req.body.State;
  projectTable.Studies = req.body.Studies;
  projectTable.Report = req.body.Report;
  projectTable.company = req.body.company;
  projectTable.refuse = req.body.refuse;
  projectTable.ApprovedTime = req.body.ApprovedTime;
  projectTable.YearTime = req.body.YearTime;
  projectTable.approvedDepartment = req.body.approvedDepartment;
  projectTable.ispast = req.body.ispast;
  projectTable.isfinish = req.body.isfinish;
  projectTable.isdelete = req.body.isdelete;
  projectTable.createUserId = req.body.createUserId;
  projectTable.createDate = req.body.createDate;
  projectTable.modifyUserId = req.body.modifyUserId;
  projectTable.modifyDate = req.body.modifyDate;
  projectTable.isStreet = req.body.isStreet;
  projectTable.is_syn = req.body.is_syn;
  projectTable.isPhoneDJ = req.body.isPhoneDJ;
  projectTable.PartyBranchID = req.body.PartyBranchID;

  projectTable.save().then(function () {
    res.json(projectTable);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an projectTable
 */
exports.delete = function (req, res) {
  var projectTable = req.model;

  projectTable.destroy().then(function () {
    res.json(projectTable);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of ProjectAnalysis
 */
exports.list = function (req, res) {
  var ProjectTable = sequelize.model('ProjectTable');
  // var User = sequelize.model('User');

  ProjectTable.findAll({
    /*include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ],*/
    order: 'id DESC'
  }).then(function (projectTables) {
    return res.jsonp(projectTables);
  }).catch(function (err) {
    logger.error('projectTable list error:', err);
    return res.status(422).send(err);
  });
};
//----分页
function listByPage(req, res, limit, offset, PartyBranchID) {
  var ProjectTable = sequelize.model('ProjectTable');
  var sql = 'select * from ( select p.*, rownum rnum from ' +
    '(select row_number() over(order by id desc) as rownum, * from ProjectTable) p ' +
    ' where rownum <= ' + offset + ') z where rnum > ' + limit;
/*  var sql = 'select * from ( select p.*, rownum rnum from ' +
    '(select row_number() over(order by id desc) as rownum, * from ProjectTable ' +
    'where PartyBranchID = ' + PartyBranchID + ') p ' +
    ' where rownum <= ' + offset + ') z where rnum > ' + limit;*/
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('ProjectTable list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数
function listCount(req, res, PartyBranchID) {
  // var sql = 'select count(*) sum from ProjectTable where PartyBranchID = ' + PartyBranchID + '';
  var sql = 'select count(*) sum from ProjectTable';
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}
/**
 * ProjectTable middleware
 */
exports.projectAnalysisByID = function (req, res, next, id) {
  var ProjectTable = sequelize.model('ProjectTable');
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
  var offset = parseInt(req.query.offset, 0);//10 每页总数
  var PartyBranchID = parseInt(req.query.PartyBranchID, 0);//PartyBranchID
  // PartyBranchID = 459;
  if (offset !== 0 && id === '0') {
    listByPage(req, res, limit, offset, PartyBranchID);
  } else if (limit === 0 && offset === 0 && id === '0') {
    listCount(req, res, PartyBranchID);
  } else if (id !== '0') {
    ProjectTable.findOne({
      where: {ProjectId: id}
    }).then(function (projectTable) {
      if (!projectTable) {
        logger.error('No projectTable with that identifier has been found');
        return res.status(404).send({
          message: 'No projectTable with that identifier has been found'
        });
      }
      req.model = projectTable;
      next();
    }).catch(function (err) {
      logger.error('projectTable ByID error:', err);
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  }
};
