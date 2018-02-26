'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize'));

var User = sequelize.model('User');
/**
 * User middleware
 */
exports.userById = function (req, res, next, id) {
  User.findOne({
    where: {
      id: id
    },
    attributes: {
      exclude: ['salt', 'password', 'providerData']
    }
  }).then(function (user) {
    if (!user) {
      return next(new Error('Failed to load user ' + id));
    }
    req.profile = user;
    next();
  }).catch(function (err) {
    return next(err);
  });
};
