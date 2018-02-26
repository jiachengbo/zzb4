'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Task Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['user', 'admin'],
    allows: [{
      resources: '/api/task',
      permissions: '*'
    }, {
      resources: '/api/task/:taskId',
      permissions: '*'
    }, {
      resources: '/api/reply',
      permissions: '*'
    }, {
      resources: '/api/addtask',
      permissions: '*'
    }, {
      resources: '/api/addtask/:addtaskId',
      permissions: '*'
    }, {
      resources: '/api/str',
      permissions: '*'
    }, {
      resources: '/api/bm',
      permissions: '*'
    }, {
      resources: '/api/addRelation',
      permissions: '*'
    }, {
      resources: '/api/count',
      permissions: '*'
    }, {
      resources: '/api/payoutbm',
      permissions: '*'
    }, {
      resources: '/api/addtaskprogress',
      permissions: '*'
    }, {
      resources: '/api/gettaskprogress',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Task Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
