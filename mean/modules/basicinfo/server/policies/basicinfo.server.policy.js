'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Basicinfo Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['notice'],
    allows: [{
      resources: '/api/basic/pioneerexemplaryinfo',
      permissions: '*'
    }, {
      resources: '/api/basic/pioneerexemplaryinfo/:pioneerexemplaryId',
      permissions: '*'
    }, {
      resources: '/api/basic/streetdynamicsinfo',
      permissions: '*'
    }, {
      resources: '/api/basic/streetdynamicsinfo/:streetdynamicsId',
      permissions: '*'
    }, {
      resources: '/api/basic/topvoiceinfo',
      permissions: '*'
    }, {
      resources: '/api/basic/topvoiceinfo/:topvoiceinfoId',
      permissions: '*'
    }, {
      resources: '/api/basic/tradeunionactivitiesinfo',
      permissions: '*'
    }, {
      resources: '/api/basic/tradeunionactivitiesinfo/:tradeunionactivitiesinfoId',
      permissions: '*'
    }, {
      resources: '/api/basic/guardianmailboxinfo',
      permissions: '*'
    }, {
      resources: '/api/basic/guardianmailboxinfo/:guardianmailboxinfoId',
      permissions: '*'
    }, {
      resources: '/api/basic/volunteerteaminfo',
      permissions: '*'
    }, {
      resources: '/api/weiquan',
      permissions: '*'
    }, {
      resources: '/api/joinus',
      permissions: '*'
    }, {
      resources: '/api/basic/volunteerteaminfo/:volunteerteaminfoId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Basicinfo Policy Allows
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
