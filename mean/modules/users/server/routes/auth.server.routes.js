'use strict';

/**
 * Module dependencies
 */
var router = require('express').Router(),
  passport = require('passport');

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users password api
  router.route('/forgot').post(users.forgot);
  router.route('/reset/:token').get(users.validateResetToken);
  router.route('/reset/:token').post(users.reset);

  // Setting up the users authentication api
  router.route('/signup').post(users.signup);
  router.route('/signin').post(users.signin);
  router.route('/signout').get(users.signout);

  // Setting the facebook oauth routes
  router.route('/facebook').get(users.oauthCall('facebook', {
    scope: ['email']
  }));
  router.route('/facebook/callback').get(users.oauthCallback('facebook'));

  // Setting the twitter oauth routes
  router.route('/twitter').get(users.oauthCall('twitter'));
  router.route('/twitter/callback').get(users.oauthCallback('twitter'));

  // Setting the google oauth routes
  router.route('/google').get(users.oauthCall('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  router.route('/google/callback').get(users.oauthCallback('google'));

  // Setting the linkedin oauth routes
  router.route('/linkedin').get(users.oauthCall('linkedin', {
    scope: [
      'r_basicprofile',
      'r_emailaddress'
    ]
  }));
  router.route('/linkedin/callback').get(users.oauthCallback('linkedin'));

  // Setting the github oauth routes
  router.route('/github').get(users.oauthCall('github'));
  router.route('/github/callback').get(users.oauthCallback('github'));

  // Setting the paypal oauth routes
  router.route('/paypal').get(users.oauthCall('paypal'));
  router.route('/paypal/callback').get(users.oauthCallback('paypal'));

  app.use('/api/auth', router);
};
