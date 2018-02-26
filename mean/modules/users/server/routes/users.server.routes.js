'use strict';

var router = require('express').Router();

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  router.route('/me').get(users.me);
  //注意，和admin routers中的路由不能重
  router.route('/').put(users.update);
  router.route('/accounts').delete(users.removeOAuthProvider);
  router.route('/password').post(users.changePassword);
  router.route('/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  //app.param('userId', users.userByID);

  app.use('/api/users', router);
};
