'use strict';

var validator = require('validator'),
  path = require('path'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  dbTools = require(path.resolve('./config/private/dbtools')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

function escape(str) {
  if (typeof(str) !== 'string') {
    return '';
  } else {
    return validator.escape(str);
  }
}

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      id: req.user.id,
      displayName: escape(req.user.displayName),
      provider: escape(req.user.provider),
      username: escape(req.user.username),
      createdAt: req.user.createdAt.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: escape(req.user.email),
      lastName: escape(req.user.lastName),
      firstName: escape(req.user.firstName),
      JCDJ_UserID: req.user.JCDJ_UserID,
      additionalProvidersData: req.user.additionalProvidersData,
      user_grade: req.user.user_grade,
      JCDJ_User_roleID: req.user.JCDJ_User_roleID,
      branch: req.user.branch,
      jobs: req.user.jobs,
      super: req.user.dj_PartyBranch.super,
      generalbranch: req.user.dj_PartyBranch.generalbranch
    };
  }

  //设置标题参数
  config.shared.title = config.app.title;
  config.shared.longTitle = config.app.longTitle;
  config.shared.copyRight = config.app.copyRight;

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });

  logger.debug('user %s load home pages from %s',
    req.user ? req.user.username : '', req.ip);
};


exports.httpMessage = function (req, res) {
  logger.debug('recv httpMessage from ip:%s,user:%s,msg:%j',
    req.ip, req.user ? req.user.username : 'nouser', req.body);
  res.status(200).end();
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {
  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
