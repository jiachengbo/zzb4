'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an problemWall
 */
var ProblemWallRec = sequelize.model('ProblemWallRec');

exports.create = function (req, res) {

  var user = req.user;
  var userGradeId = parseInt(user.user_grade, 0);
  var userRoleId = parseInt(user.JCDJ_User_roleID, 0);
  var userDisplayName = user.displayName;
  var queryParams = req.query;
  var wtId = queryParams.wtId;
  var method = queryParams.method;
  // console.info('----------------------------method------------------------');
  // console.info(method);
  var problemWallRecData;
  if (method === '1' || method === '2') {
    problemWallRecData = JSON.parse(queryParams.problemWallRecData);
  }

  var sbs = '';
  var xfs = '';
  if (queryParams.sbs !== '' || queryParams.sbs !== null && queryParams.sbs !== undefined) {
    sbs = queryParams.sbs;
  }
  if (queryParams.xfs !== '' || queryParams.xfs !== null && queryParams.xfs !== undefined) {
    xfs = queryParams.xfs;
  }

  if (method === '3') {
    // console.info('****************************');
    var delRec = JSON.parse(queryParams.delRec);
    //  删除 上报下发记录
    if (delRec !== undefined) {
      for (var k = 0; k < delRec.length; k++) {
        var itemk = delRec[k];
        var gradeIdk = itemk.gradeId;
        var roleIdk = itemk.roleId;
        // console.info(itemk);
        var where;
        if (gradeIdk === 1 || gradeIdk === 5 || gradeIdk === 4) {
          where = {
            wtId: wtId,
            gradeId: gradeIdk,
            roleId: roleIdk
          };
        }
        if (gradeIdk === 7 || gradeIdk === 6) {
          where = {
            wtId: wtId,
            gradeId: gradeIdk,
            roleId: roleIdk,
            branchId: itemk.branchId
          };
        }
        if (gradeIdk === 10 || gradeIdk === 9) {
          where = {
            wtId: wtId,
            gradeId: gradeIdk,
            roleId: roleIdk,
            generalBranch: itemk.generalBranch
          };
        }
        ProblemWallRec.findOne({
          where: where
        }).then(function (problemWallRec) {
          if (!problemWallRec) {
            logger.error('No problemWallRec with that identifier has been found');
            return res.status(404).send({
              message: 'No problemWallRec with that identifier has been found'
            });
          }
          problemWallRec.destroy().then(function (problemWallRec) {
            console.info('---删除记录成功-id=' + problemWallRec.id);
          }).catch(function (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
        }).catch(function (err) {
          logger.error('problemWallRec ByID error:', err);
          res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        });
      }
    }
  }
  if (problemWallRecData !== undefined) {
    for (var i = 0; i < problemWallRecData.length; i++) {
      var item = problemWallRecData[i];
      var problemWallRec = ProblemWallRec.build(item);
      // 查询数据库是否已经存在该记录
      if (problemWallRec) {
        problemWallRec.wtId = wtId;
        problemWallRec.gradeId = item.gradeId;
        problemWallRec.roleId = item.roleId;
        problemWallRec.branchId = item.branchId;
        problemWallRec.generalBranch = item.generalBranch;
        problemWallRec.streetID = item.streetID;
        problemWallRec.communityId = item.communityId;
        problemWallRec.belongGrid = item.belongGrid;
        problemWallRec.createDate = new Date();
        problemWallRec.createUserName = item.createUserName;
        problemWallRec.isCreateUser = item.isCreateUser;
        problemWallRec.save().then(function (problemWallRec) {
          if (problemWallRec.createUserName === userDisplayName) {
            updateSbXfCol();
          }
        }).catch(function (err) {
          logger.error('新增异常:', err);
          res.status(422).send(err);
        });
      }
    }

  }
  // 当sbs xfs 非空 ，修改请求者的 sbs xfs
  if (method === '2') {
    updateSbXfCol();
  }

  function updateSbXfCol() {
    ProblemWallRec.findOne({
      where: {
        wtId: wtId,
        gradeId: userGradeId,
        roleId: userRoleId
      }
    }).then(function (problemWallRec) {
      problemWallRec.sbs = sbs;
      problemWallRec.xfs = xfs;
      problemWallRec.save()
        .then(function () {
          res.json([problemWallRec]);
        })
        .catch(function (err) {
          logger.error('修改sbxf异常:', err);
          res.status(422).send(err);
        });
    });
  }

};

/**
 * Show the current problemWall
 */
exports.read = function (req, res) {
};

/**
 * Update an problemWallRec
 */
exports.update = function (req, res) {
};

/**
 * Delete an problemWallRec
 */
exports.delete = function (req, res) {
};

/**
 * List of ProblemWallRec
 */
exports.list = function (req, res) {/*
 var ProblemWallRec = sequelize.model('ProblemWallRec');

 ProblemWallRec.findAll({
 order: 'id desc'
 }).then(function (problemWallRec) {
 return res.jsonp(problemWallRec);
 }).catch(function (err) {
 logger.error('problemWallRec list error:', err);
 return res.status(422).send(err);
 });*/
};

/**
 * ProblemWallRec middleware
 */
exports.problemWallRecByID = function (req, res, next, id) {
  id = Number(id);
  ProblemWallRec.findOne({
    where: {id: id}
  }).then(function (problemWallRec) {
    if (!problemWallRec) {
      logger.error('No problemWallRec with that identifier has been found');
      return res.status(404).send({
        message: 'No problemWallRec with that identifier has been found'
      });
    }

    problemWallRec.destroy().then(function (problemWallRec) {
      res.jsonp([problemWallRec]);
    }).catch(function (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  }).catch(function (err) {
    logger.error('problemWallRec ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
