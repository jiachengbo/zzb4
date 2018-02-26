'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * List of dj_PartyBranch
 */
exports.list = function (req, res) {
  var type = req.query.type;//分析类型
  var startDate = req.query.startTime;//开始时间
  var stopDate = req.query.stopTime;//结束时间
  var tj_data;
  if (typeof(startDate) == 'undefined' || typeof(stopDate) == 'undefined') {
    tj_data = '';
  } else {
    tj_data = ' and createDate >= \'' + startDate + '\' and createDate <= \'' + stopDate + '\'';
  }
  var sql = '';
  if (type === '2') {
    sql = 'select count(CASE WHEN OrganizationNum <= 10  THEN \'10\' end) one,' +
      ' count(CASE WHEN OrganizationNum > 10 and  OrganizationNum <= 20 THEN \'30\' end) two,' +
      ' count(CASE WHEN OrganizationNum > 20 and  OrganizationNum <= 30 THEN \'30\' end) three,' +
      ' count(CASE WHEN OrganizationNum > 30 and  OrganizationNum <= 40 THEN \'30\' end) four,' +
      ' count(CASE WHEN OrganizationNum > 40  THEN \'30\' end) five' +
      ' from dj_PartyBranch where isdelete=0 ' + tj_data + '';
  } else if (type === '3') {
    sql = 'select count(CASE Relations WHEN \'区内\' THEN \'区内\' end) qn,' +
      ' count(CASE Relations WHEN \'驻地\' THEN \'驻地\' end) zd ' +
      ' from dj_PartyBranch where isdelete=0 ' + tj_data + '';
  } else if (type === '4') {
    sql = 'select count(CASE Category WHEN \'机关\' THEN \'1\' end) jg ,' +
      ' count (CASE Category WHEN \'事业单位\' THEN \'2\' end ) sydw ,' +
      ' count (CASE Category WHEN \'企业单位\' THEN \'3\' end) qydw,' +
      ' count (CASE Category WHEN \'社区\' THEN \'4\' end ) sq ,' +
      ' count (CASE Category WHEN \'非公经济组织\' THEN \'5\' end) fg,' +
      ' count (CASE Category WHEN \'社会组织\' THEN \'6\' end ) shzz' +
      ' from dj_PartyBranch where isdelete=0 ' + tj_data + '';
  } else {
    sql = 'select count(CASE OrganizationCategory WHEN \'党委\' THEN \'党委\' end) dw,' +
      ' count (CASE OrganizationCategory WHEN \'党工委\' THEN \'党工委\' end ) dgw ,' +
      ' count (CASE OrganizationCategory WHEN \'党总支\' THEN \'党总支\' end ) dzz ,' +
      ' count (CASE OrganizationCategory WHEN \'党支部\' THEN \'党支部\' end ) dzb ' +
      ' from dj_PartyBranch where isdelete=0 ' + tj_data + '';
  }
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
};
