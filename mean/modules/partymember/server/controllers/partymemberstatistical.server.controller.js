'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * List of dj_PartyMember
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
    sql = 'select count(CASE Category WHEN \'在册\' THEN \'在册\' end) register,' +
      ' count (CASE Category WHEN \'非在册\' THEN \'非在册\' end ) nonregister ' +
      ' from dj_PartyMember where isdelete=0 ' + tj_data + '';
  } else if (type === '3') {
    sql = 'select count(CASE WHEN datediff(year,PartyBirth,getdate()) <= 30 THEN \'30\' end) \'one\',' +
      ' count(CASE WHEN datediff(year,PartyBirth,getdate()) > 30 and  datediff(year,PartyBirth,getdate()) <= 40 THEN \'30\' end) \'two\',' +
      ' count(CASE WHEN datediff(year,PartyBirth,getdate()) > 40 and  datediff(year,PartyBirth,getdate()) <= 50 THEN \'30\' end) \'three\',' +
      ' count(CASE WHEN datediff(year,PartyBirth,getdate()) > 50 and  datediff(year,PartyBirth,getdate()) <= 60 THEN \'30\' end) \'four\',' +
      ' count(CASE WHEN datediff(year,PartyBirth,getdate()) > 60 THEN \'30\' end) \'five\'' +
      ' from dj_PartyMember where isdelete=0 ' + tj_data + '';
  } else {
    sql = 'select count(CASE PartySex WHEN \'男\' THEN \'男\' end) men,' +
      ' count (CASE PartySex WHEN \'女\' THEN \'女\' end ) women ' +
      ' from dj_PartyMember where isdelete=0 ' + tj_data + '';
  }
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
};
