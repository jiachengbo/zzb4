'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Module init function.
 */
module.exports = function (app, sequelize) {
/*

  //创建自己的表
  var Buildbuild = sequelize.model('BuildbuildPerson');
  Buildbuild.sync({
    force: true,
    loging: true
  })
  .then(function () {
    logger.info('Database table Buildbuild synchronized OK!');
  }).catch(function (err) {
    logger.error('Database table Buildbuild synchronized error: ', err);
    throw err;
  });
*/

};
