'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 *
 */
module.exports = function (app, db) {
  /*
    //创建自己的表
    var CommTask = db.model('CommTask');
    CommTask.sync({
      force: true,
      loging: true
    })
      .then(function () {
        logger.info('Database table CommTask synchronized OK!');
      })
      .catch(function (err) {
        logger.error('Database table CommTask synchronized error: ', err);
        throw err;
      });
  */
};
