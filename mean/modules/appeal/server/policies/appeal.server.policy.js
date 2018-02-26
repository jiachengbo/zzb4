'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Appeal Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['partydt'],
    allows: [{
      resources: '/api/appeal',
      permissions: '*'
    }, {
      resources: '/api/appeal/:appealId',
      permissions: '*'
    }, {
      resources: '/api/appealsb',
      permissions: '*'
    }, {
      resources: '/api/appealsb/:id',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Appeal Policy Allows
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
