'use strict';

var path = require('path'),
  dbTools = require(path.resolve('./config/private/dbtools')),
  logger = require(path.resolve('./config/lib/logger')).getLogger('socketio.server');

function init_cfgs() {
  var allParams = dbTools.getAllParam();

  var ret = {};
  for (var name in allParams) {
    if (name.startsWith('jdbtx_')) {
      var cfg = allParams[name];
      if (!cfg) {
        logger.error('sysparam %s value %j', name, cfg);
        continue;
      } else if (typeof(cfg) !== 'object') {
        logger.error('sysparam %s value %j not object', name, cfg);
        continue;
      } else if (!cfg.hasOwnProperty('userId')) {
        logger.error('sysparam %s value %j no userId column', name, cfg);
        continue;
      } else if (!cfg.hasOwnProperty('url')) {
        logger.error('sysparam %s value %j no url column', name, cfg);
        continue;
      } else if (!cfg.hasOwnProperty('streetID')) {
        logger.error('sysparam %s value %j no streetID column', name, cfg);
        continue;
      }
      ret[name] = cfg;
    }
  }
  return ret;
}


//http任务配置参数
//查找系统参数中每个街办的配置信息
exports._cfgs = init_cfgs();

exports.getCfgs = function() {
  return this._cfgs;
};

exports.getArrayCfgs = function() {
  var ret = [];
  for (var name in this._cfgs) {
    ret.push(this._cfgs[name]);
  }
  return ret;
};

exports.getStreetCfg = function(streetID) {
  for (var name in this._cfgs) {
    var cfg = this._cfgs[name];
    if (cfg.streetID === streetID) {
      return cfg;
    }
  }
  return null;
};
