'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Workposition Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['user', 'admin'],
    allows: [{
      resources: '/',
      permissions: '*'
    }, {
      resources: '/:workpositionId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Workposition Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  if (!req.user) {
    return res.status(401).send('Unexpected null user error');
  }

  var roles = req.user.roles;

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
