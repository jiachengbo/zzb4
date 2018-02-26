'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Regionalization Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['project'],
    allows: [{
      resources: '/api/regionalization/project',
      permissions: '*'
    }, {
      resources: '/api/regionalization/project/:ProjectId',
      permissions: '*'
    }, {
      resources: '/api/regionalization/progress',
      permissions: '*'
    }, {
      resources: '/api/regionalization/progress/:ProgressId',
      permissions: '*'
    }, {
      resources: '/api/regionalization/projectapproval/:approvalId',
      permissions: '*'
    }, {
      resources: '/api/regionalization/projectknot/:knotId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Regionalization Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  //return next();
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
